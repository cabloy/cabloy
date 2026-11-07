import type {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'node:http';
import type { VonaApplication } from 'vona';
import type { IMcpToolCatalogItem, IMcpToolIdentity, TypeMcpScope } from 'vona-module-mcp-auth';
import type { DtoStudentCreate, DtoStudentUpdate } from 'vona-module-training-student';

import fse from 'fs-extra';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { request } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { isDeepStrictEqual } from 'node:util';
import { acquireTestLock, app } from 'vona-mock';
import { BeanExecutor } from 'vona-module-a-executor';
import {
  closeMcpTransport,
  fixtureIngressLimits,
  handleMcpRequest,
  mcpTransportSnapshot,
} from 'vona-module-cabloy-mcp';
import { getMcpIssuer } from 'vona-module-mcp-auth';

import { ServiceAuthorization } from '../../mcp-auth/src/service/authorization.ts';
import { resolveSchema } from '../src/lib/controllerToolSchema.ts';

const version = '2026-07-28';
const categoriesName = 'commerce_categories_list';
const searchName = 'commerce_products_search';
const detailName = 'commerce_product_detail';
const studentCreateName = 'training-student_student_create';
const studentUpdateName = 'training-student_student_update';
const studentDeleteName = 'training-student_student_delete';
const studentSummaryName = 'training-student_student_summary';
const studentSelectName = 'training-student_student_select';
const studentViewName = 'training-student_student_view';
const studentGroupName = 'training-student_student_group';
const studentAggregateName = 'training-student_student_aggregate';
const publicReadNames = [
  categoriesName,
  searchName,
  detailName,
  'mcp_test_action_status',
  'mcp_test_action_scalar',
  'mcp_test_action_array',
];
const excludedNames = [
  'mcp_test_action_unsupported',
  'mcp-test_catalog_excluded',
  'mcp-test_toolFixture_excluded',
  'mcp-test_toolFixture_closed',
  'training_student_select',
  'training-student_student_deleteForce',
  'training-student_student_deleteBulk',
];
const trainingDisabled = (process.env.PROJECT_DISABLED_SUITES ?? '')
  .split(',')
  .includes('a-training');
const studentSummaryFields = [
  'id',
  'name',
  'level',
  'levelTitle',
  'descriptionLength',
  'summaryText',
].sort();
let port: number;
let bearer: string;
let origin: string;
let resource: string;
let clientId: string;
let dynamicClientId: string | undefined;
let redirectUri: string;
let fixtureUserId: string | undefined;
let fixtureAuthId: string | undefined;
let fixtureAuthSimpleId: string | undefined;
let browserToken: string;
const ownedRequests: string[] = [];

async function redeemTokens(
  scope: 'mcp:all' | 'mcp:read' = 'mcp:read',
  oauthClientId = clientId,
  effectiveScope?: TypeMcpScope,
) {
  const verifier = randomBytes(32).toString('base64url');
  const requestId = await app.bean.executor.mockCtx(
    async () => {
      return await app.scope('mcp-auth').service.authorization.authorize(
        new URLSearchParams({
          response_type: 'code',
          client_id: oauthClientId,
          redirect_uri: redirectUri,
          resource,
          scope,
          code_challenge_method: 'S256',
          code_challenge: createHash('sha256').update(verifier).digest('base64url'),
        }),
        { resource, instanceName: '' },
      );
    },
    { instanceName: '' },
  );
  ownedRequests.push(requestId);
  const decided = await openHttp({
    target: '/mcp/auth/decision',
    headers: { authorization: `Bearer ${browserToken}`, origin },
    body: JSON.stringify({ request: requestId, allow: true, scope: effectiveScope }),
  }).response;
  assert.equal(decided.status, 200);
  const callback = new URL(decided.body.data.redirectUrl);
  const code = callback.searchParams.get('code');
  assert.ok(code);
  const token = await openHttp({
    target: '/mcp/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: oauthClientId,
      redirect_uri: redirectUri,
      resource,
      code,
      code_verifier: verifier,
    }).toString(),
  }).response;
  assert.equal(token.status, 200);
  assert.equal(token.headers['cache-control'], 'no-store');
  assert.equal(token.body.token_type, 'Bearer');
  assert.equal(token.body.scope, effectiveScope ?? scope);
  assert.equal(token.body.expires_in, 7200);
  assert.match(token.body.access_token, /^[\w-]+\.[\w-]+\.[\w-]+$/);
  return token.body as { access_token: string; refresh_token?: string };
}

async function redeemBearer(scope: 'mcp:all' | 'mcp:read' = 'mcp:read') {
  const token = await redeemTokens(scope);
  assert.equal('refresh_token' in token, false);
  return token.access_token;
}

async function issuedTokenDigest(token: string) {
  const verified = await app.bean.jwt.get('mcpAccess').verify(token);
  assert.ok(verified);
  const payload = app.scope('mcp-auth').service.authTokenAdapter.payload(verified);
  return createHash('sha256').update(payload.token).digest('hex');
}

function openHttp(
  options: {
    target?: string;
    method?: string;
    headers?: OutgoingHttpHeaders;
    body?: string;
    partial?: boolean;
  } = {},
) {
  const body = options.body ?? '';
  const req = request({
    hostname: '127.0.0.1',
    port,
    path: options.target ?? '/mcp',
    method: options.method ?? 'POST',
    agent: false,
    headers: {
      'host': new URL(origin).host,
      'content-type': 'application/json',
      'accept': 'application/json, text/event-stream',
      'connection': 'close',
      'content-length': Buffer.byteLength(body),
      ...options.headers,
    },
  });
  const response = new Promise<{ status: number; body: any; headers: IncomingHttpHeaders }>(
    (resolve, reject) => {
      const timer = setTimeout(() => req.destroy(new Error('Business MCP HTTP timeout')), 15000);
      req.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      req.once('response', res => {
        const chunks: Buffer[] = [];
        let size = 0;
        res.on('data', (chunk: Buffer) => {
          size += chunk.length;
          if (size > 1024 * 1024) res.destroy(new Error('Business MCP response limit'));
          else chunks.push(chunk);
        });
        res.once('error', error => {
          clearTimeout(timer);
          reject(error);
        });
        res.once('end', () => {
          clearTimeout(timer);
          try {
            const text = Buffer.concat(chunks).toString('utf8');
            resolve({
              status: res.statusCode!,
              body: text ? JSON.parse(text) : undefined,
              headers: res.headers,
            });
          } catch (error) {
            reject(error);
          }
        });
      });
    },
  );
  void response.catch(() => {});
  if (options.partial) req.write(body);
  else req.end(body);
  return { req, response };
}

async function waitFor(predicate: () => boolean) {
  const deadline = Date.now() + 5000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, 'business exchange actually settled');
    await delay(5);
  }
}

async function send(
  method: string,
  params: Record<string, unknown> = {},
  options: { target?: string; headers?: OutgoingHttpHeaders; legacy?: boolean } = {},
) {
  const response = await openHttp({
    target: options.target,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params: options.legacy
        ? params
        : {
            ...params,
            _meta: {
              'io.modelcontextprotocol/protocolVersion': version,
              'io.modelcontextprotocol/clientCapabilities': {},
            },
          },
    }),
    headers: {
      authorization: `Bearer ${bearer}`,
      ...(options.legacy
        ? method === 'initialize'
          ? {}
          : {
              'mcp-protocol-version': '2025-11-25',
            }
        : {
            'mcp-protocol-version': version,
            'mcp-method': method,
            ...(typeof params.name === 'string' ? { 'mcp-name': params.name } : {}),
          }),
      ...options.headers,
    },
  }).response;
  if (response.status !== 429) await waitFor(() => !mcpTransportSnapshot(app)?.active);
  return response;
}

function output(response: Awaited<ReturnType<typeof send>>) {
  assert.equal(response.status, 200);
  assert.equal(response.body.error, undefined);
  assert.notEqual(response.body.result.isError, true);
  const result = response.body.result;
  assert.deepEqual(result.content, [
    { type: 'text', text: JSON.stringify(result.structuredContent) },
  ]);
  return result.structuredContent;
}

function studentToolNames(tools: Array<{ name: string }>): string[] {
  return tools.map(tool => tool.name).filter(name => name.startsWith('training-student_student_'));
}

function allowStudentAction(
  action: 'create' | 'update' | 'delete' | 'select' | 'view' | 'summary',
) {
  const controller = 'training-student.controller.student';
  return app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
    if (
      String(app.bean.passport.currentUser?.id) !== fixtureUserId ||
      app.ctx.instanceName !== '' ||
      request.action.controllerBeanFullName !== controller
    ) {
      return next();
    }
    assert.equal(String(app.bean.passport.currentAuth?.id), fixtureAuthId);
    return {
      allowed: request.action.action === action,
      actionKey: request.action.actionKey,
      action: request.action,
    };
  });
}

// The root managed test runner owns this listener and disposable instance state.
// No test creates another application/listener or changes global origin configuration.
describe('businessHttp.test.ts', { concurrency: false, timeout: 60000 }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    assert.ok(app.server?.listening, 'managed application listener must be enabled');
    const address = app.server.address();
    assert.ok(address && typeof address === 'object');
    port = address.port;
    resource = getMcpIssuer(app);
    origin = new URL(resource).origin;
    redirectUri = `${origin}/mcp-test-callback`;
    release = await acquireTestLock('mcp-test');
    const registration = await openHttp({
      target: '/mcp/register',
      headers: {
        'host': new URL(origin).host,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        application_type: 'native',
        client_name: 'Managed MCP dynamic test',
        redirect_uris: [redirectUri],
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code'],
        response_types: ['code'],
        scope: 'mcp:all mcp:read',
      }),
    }).response;
    assert.equal(registration.status, 201);
    assert.equal(registration.body.token_endpoint_auth_method, 'none');
    assert.deepEqual(registration.body.redirect_uris, [redirectUri]);
    assert.equal(registration.body.scope, 'mcp:all');
    assert.deepEqual(registration.body.grant_types, ['authorization_code']);
    assert.equal('refresh_token' in registration.body, false);
    assert.equal('application_type' in registration.body, false);
    assert.match(registration.body.client_id, /^[\w-]{43}$/);
    assert.equal(typeof registration.body.client_id, 'string');
    dynamicClientId = registration.body.client_id as string;
    clientId = dynamicClientId;
    // Selector probes may touch this shared instance through the ordinary request lifecycle.
    // Finish its managed startup before writing default-instance authorization fixtures.
    await app.bean.executor.mockCtx(async () => {}, { instanceName: 'shareTest' as any });
    await app.bean.executor.mockCtx(
      async () => {
        const user = await app.bean.user.register(
          { name: `mcp-business-http-${randomUUID()}` },
          true,
        );
        fixtureUserId = String(user.id);
        const authSimple = await app
          .scope('auth-simple')
          .service.authSimple.createForUser(user.id, 'mcp-test-password');
        assert.ok(authSimple);
        fixtureAuthSimpleId = String(authSimple.id);
        const auth = await app.scope('a-auth').model.auth.get({ userId: user.id });
        assert.ok(auth);
        fixtureAuthId = String(auth.id);
        const currentUser = await app.bean.user.findOneById(user.id);
        const jwt = await app.bean.passport.signin({
          user: currentUser,
          auth,
          roles: await app.bean.role.findAllByUserId(user.id),
        });
        browserToken = jwt.accessToken;
      },
      { instanceName: '' },
    );
    bearer = await redeemBearer();
  });
  after(async () => {
    try {
      await app.bean.executor.mockCtx(
        async () => {
          for (const requestId of ownedRequests) {
            await app.scope('mcp-auth').model.authorization.delete({
              requestDigest: createHash('sha256').update(requestId).digest('hex'),
            });
          }
          if (dynamicClientId) {
            await app.scope('mcp-auth').model.client.delete({ oauthClientId: dynamicClientId });
          }
          if (browserToken) {
            await app.bean.passport.checkAuthToken(browserToken);
            await app.bean.passport.signout();
          }
          if (fixtureAuthId) await app.scope('a-auth').model.auth.deleteById(fixtureAuthId);
          if (fixtureAuthSimpleId)
            await app.scope('auth-simple').model.authSimple.deleteById(fixtureAuthSimpleId);
          if (fixtureUserId) {
            await app.scope('home-user').model.roleUser.delete({ userId: fixtureUserId });
            await app.bean.user.removeById(fixtureUserId);
          }
        },
        { instanceName: '' },
      );
    } finally {
      release?.();
    }
  });

  it('owns ingress and close exactly once and shares modern/legacy discovery on the managed listener', async () => {
    const owners = app.bean.onion.middlewareSystem
      .getOnionsEnabledCached()
      .map(item => item.beanOptions.beanFullName)
      .filter(name =>
        ['cabloy-mcp.middlewareSystem.mcp', 'mcp-test.middlewareSystem.mcp'].includes(name),
      );
    assert.deepEqual(owners, ['cabloy-mcp.middlewareSystem.mcp']);
    const closeOwners = app.meta.modulesMonkey.filter(
      module =>
        ['cabloy-mcp', 'mcp-test'].includes(module.info.relativeName) &&
        typeof module.monkeyInstance?.appClose === 'function',
    );
    assert.deepEqual(
      closeOwners.map(module => module.info.relativeName),
      ['cabloy-mcp'],
    );
    assert.ok(app.meta.modules['cabloy-mcp']);
    if ((process.env.PROJECT_DISABLED_MODULES ?? '').split(',').includes('mcp-test')) {
      assert.equal(app.meta.modules['mcp-test'], undefined);
    } else {
      assert.ok(app.meta.modules['mcp-test'], 'default composition retains the synthetic fixtures');
    }
    if (trainingDisabled) {
      assert.equal(app.meta.modules['training-student'], undefined);
    } else {
      assert.ok(
        app.meta.modules['training-student'],
        'Training absence must be explicitly selected',
      );
    }
    const server = app.server;
    const discovered = await send('server/discover');
    assert.equal(discovered.status, 200);
    assert.deepEqual(discovered.body.result.supportedVersions, [version]);
    const allToken = await redeemBearer('mcp:all');
    for (const { token, legacy } of [bearer, allToken].flatMap(token =>
      [false, true].map(legacy => ({ token, legacy })),
    )) {
      const headers = { authorization: `Bearer ${token}` };
      if (legacy) {
        const initialized = await send(
          'initialize',
          {
            protocolVersion: '2025-11-25',
            capabilities: {},
            clientInfo: { name: 'business-http-test', version: '1' },
          },
          { legacy, headers },
        );
        assert.equal(initialized.status, 200);
        assert.equal(initialized.body.result.protocolVersion, '2025-11-25');
      }
      const listed = await send('tools/list', {}, { legacy, headers });
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      assert.deepEqual(
        studentToolNames(listed.body.result.tools),
        [],
        'ordinary OAuth identity has no student grants',
      );
      if (app.meta.modules['mcp-test']) {
        const names = listed.body.result.tools.map((tool: any) => tool.name);
        for (const name of publicReadNames) {
          assert.ok(names.includes(name), 'public opted-in fixtures remain discoverable');
        }
        assert.equal(names.includes('mcp_test_action_effect'), token === allToken);
      }
      if (trainingDisabled) {
        for (const [name, args] of [
          [studentCreateName, { name: 'Unavailable student', mobile: '13812345678', level: 1 }],
          [
            studentUpdateName,
            {
              params: { id: '1' },
              body: { name: 'Unavailable student', mobile: '13812345678', level: 1 },
            },
          ],
          [studentDeleteName, { id: '1' }],
          [studentSelectName, { name: 'Student', pageNo: 1, pageSize: 1 }],
          [studentGroupName, { name: 'Student' }],
          [studentAggregateName, { name: 'Student' }],
          [studentViewName, { id: '1' }],
          [studentSummaryName, { id: '1' }],
        ] as const) {
          const denied = await send('tools/call', { name, arguments: args }, { legacy, headers });
          assert.equal(denied.status, 200);
          assert.equal(denied.body.error?.code, -32602);
          assert.equal(denied.body.result, undefined);
        }
      }
    }
    assert.equal(app.server, server);
    assert.ok(app.server?.listening, 'per-request cleanup does not close shared server');
  });

  it('makes unsupported, unannotated and unapproved sibling names uncallable under both scopes and transports', async t => {
    const allToken = await redeemBearer('mcp:all');
    const executor = app.bean.executor;
    const original = executor.performAction;
    const observed = t.mock.method(
      executor,
      'performAction',
      async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
        assert.fail(`excluded tool reached performAction: ${String(args[1])}`);
        return await original.apply(this, args);
      },
    );
    try {
      for (const { token, legacy } of [bearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        const options = { legacy, headers: { authorization: `Bearer ${token}` } };
        const listed = await send('tools/list', {}, options);
        assert.equal(listed.status, 200);
        assert.equal(listed.body.error, undefined);
        for (const name of excludedNames) {
          assert.equal(
            listed.body.result.tools.some((tool: any) => tool.name === name),
            false,
          );
          const denied = await send('tools/call', { name, arguments: {} }, options);
          assert.equal(denied.status, 200);
          assert.equal(denied.body.error?.code, -32602);
          assert.equal(denied.body.result, undefined);
        }
      }
      assert.equal(observed.mock.callCount(), 0, 'restriction precedes ordinary Action dispatch');
    } finally {
      observed.mock.restore();
    }
  });

  it('denies unknown modes before any downstream application or request access', async () => {
    for (const meta of [{ isDev: false, isTest: false, isProd: false, mode: 'unknown' }, {}]) {
      let status = 0;
      let headers: Record<string, string> = {};
      let body = '';
      const deniedApp = {
        meta,
        get scope() {
          return assert.fail('mode denial must precede scope access');
        },
        get config() {
          return assert.fail('mode denial must precede config access');
        },
        get bean() {
          return assert.fail('mode denial must precede business/context access');
        },
      } as unknown as VonaApplication;
      const req = {
        get url() {
          return assert.fail('mode denial must precede request parsing');
        },
        get rawHeaders() {
          return assert.fail('mode denial must precede authentication');
        },
      } as unknown as IncomingMessage;
      const res = {
        destroyed: false,
        writableEnded: false,
        writeHead(code: number, values: Record<string, string>) {
          status = code;
          headers = values;
        },
        end(value: string) {
          body = value;
        },
      } as unknown as ServerResponse;
      await handleMcpRequest(deniedApp, req, res);
      assert.equal(status, 503);
      assert.equal(headers['cache-control'], 'no-store');
      assert.deepEqual(JSON.parse(body), {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: 'Request rejected' },
      });
      assert.equal(mcpTransportSnapshot(deniedApp), undefined);
    }
  });

  it('admits production to authentication while retaining readiness and authority denials', async () => {
    for (const scenario of ['ready', 'not-ready', 'closing', 'disabled', 'missing-authority']) {
      let status = 0;
      let headers: Record<string, string> = {};
      let body = '';
      let contexts = 0;
      const productionApp = {
        meta: {
          isDev: false,
          isTest: false,
          isProd: true,
          mode: 'prod',
          env: { META_MODE: 'prod' },
          appReady: scenario !== 'not-ready',
          appClose: scenario === 'closing',
        },
        scope(name: string) {
          assert.equal(name, 'cabloy-mcp');
          return { config: { enabled: scenario !== 'disabled' } };
        },
        config: {
          instance: { queryField: 'instanceName', headerField: 'x-vona-instance-name' },
          server: {
            serve:
              scenario === 'missing-authority'
                ? {}
                : { protocol: 'https', host: 'mcp.example.test' },
          },
          modules: {
            'mcp-auth': {
              pendingTtl: 600,
              codeTtl: 60,
              tokenTtl: 900,
              refreshTokenTtl: 604800,
              allowLoopbackHttp: true,
            },
          },
        },
        createAnonymousContext(input: unknown) {
          contexts++;
          assert.deepEqual(input, {
            headers: { host: 'mcp.example.test' },
            method: 'POST',
            url: '/mcp',
            socket: { encrypted: true },
          });
          return { instanceName: '' };
        },
        get bean() {
          return assert.fail('admission fixtures must not enter business execution');
        },
      } as unknown as VonaApplication;
      const req = {
        url: '/mcp',
        method: 'POST',
        rawHeaders: [
          'host',
          'mcp.example.test',
          'content-type',
          'application/json',
          'accept',
          'application/json, text/event-stream',
        ],
      } as unknown as IncomingMessage;
      const res = {
        destroyed: false,
        writableEnded: false,
        writeHead(code: number, values: Record<string, string>) {
          status = code;
          headers = values;
        },
        end(value: string) {
          body = value;
        },
      } as unknown as ServerResponse;
      await handleMcpRequest(productionApp, req, res);
      assert.equal(status, scenario === 'ready' ? 401 : 503, scenario);
      assert.equal(contexts, scenario === 'ready' ? 1 : 0, scenario);
      assert.equal(headers['cache-control'], 'no-store');
      assert.equal(
        headers['www-authenticate'],
        scenario === 'ready'
          ? 'Bearer resource_metadata="https://mcp.example.test/.well-known/oauth-protected-resource/mcp"'
          : undefined,
      );
      assert.deepEqual(JSON.parse(body), {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: 'Request rejected' },
      });
      assert.equal(mcpTransportSnapshot(productionApp), undefined);
    }
  });

  it('discovers only currently authorized student Actions without business work and reauthorizes calls', async t => {
    if (trainingDisabled) return;
    assert.ok(app.meta.modules['training-student']);
    const allToken = await redeemBearer('mcp:all');
    const { ControllerStudent, ModelStudent, ServiceStudent } =
      await import('vona-module-training-student');
    const business = [
      t.mock.method(ControllerStudent.prototype, 'create'),
      t.mock.method(ServiceStudent.prototype, 'create'),
      t.mock.method(ModelStudent.prototype, 'insert'),
      t.mock.method(ControllerStudent.prototype, 'update'),
      t.mock.method(ServiceStudent.prototype, 'update'),
      t.mock.method(ModelStudent.prototype, 'update'),
      t.mock.method(ControllerStudent.prototype, 'delete'),
      t.mock.method(ServiceStudent.prototype, 'delete'),
      t.mock.method(ModelStudent.prototype, 'delete'),
      t.mock.method(ControllerStudent.prototype, 'select'),
      t.mock.method(ControllerStudent.prototype, 'group'),
      t.mock.method(ControllerStudent.prototype, 'aggregate'),
      t.mock.method(ControllerStudent.prototype, 'view'),
      t.mock.method(ControllerStudent.prototype, 'summary'),
      t.mock.method(ServiceStudent.prototype, 'select'),
      t.mock.method(ServiceStudent.prototype, 'group'),
      t.mock.method(ServiceStudent.prototype, 'aggregate'),
      t.mock.method(ServiceStudent.prototype, 'view'),
      t.mock.method(ServiceStudent.prototype, 'summary'),
      t.mock.method(ModelStudent.prototype, 'select'),
      t.mock.method(ModelStudent.prototype, 'count'),
      t.mock.method(ModelStudent.prototype, 'get'),
    ];
    const controller = 'training-student.controller.student';
    let granted: string[] = [];
    let broken = false;
    const policyCalls: string[] = [];
    const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
      if (
        String(app.bean.passport.currentUser?.id) !== fixtureUserId ||
        app.ctx.instanceName !== '' ||
        request.action.controllerBeanFullName !== controller
      ) {
        return next();
      }
      assert.equal(String(app.bean.passport.currentAuth?.id), fixtureAuthId);
      assert.equal(
        app.bean.passport.currentRoles?.some(role => role.name === 'systemAdmin'),
        false,
      );
      policyCalls.push(request.action.actionKey);
      if (broken && request.action.action === 'summary') {
        throw new Error('private discovery failure detail');
      }
      // Ordinary non-data-scoped admission deliberately has no matcher terms.
      return {
        allowed: granted.includes(request.policyActionKey),
        actionKey: request.action.actionKey,
        action: request.action,
      };
    });
    const states = [
      { permissions: [], names: [] },
      {
        permissions: ['select'],
        names: [studentSelectName, studentGroupName, studentAggregateName],
      },
      { permissions: ['view'], names: [studentViewName, studentSummaryName] },
      {
        permissions: ['select', 'view'],
        names: [
          studentSelectName,
          studentGroupName,
          studentAggregateName,
          studentViewName,
          studentSummaryName,
        ],
      },
      { permissions: ['create'], names: [] },
      { permissions: ['update'], names: [] },
      { permissions: ['delete'], names: [] },
      {
        permissions: ['create', 'select', 'view'],
        names: [
          studentSelectName,
          studentGroupName,
          studentAggregateName,
          studentViewName,
          studentSummaryName,
        ],
      },
      {
        permissions: ['create', 'update', 'delete', 'select', 'view'],
        names: [
          studentSelectName,
          studentGroupName,
          studentAggregateName,
          studentViewName,
          studentSummaryName,
        ],
      },
      { permissions: [], names: [] },
    ];
    try {
      for (const { token, legacy } of [bearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        const options = { legacy, headers: { authorization: `Bearer ${token}` } };
        for (const state of states) {
          granted = state.permissions.map(permission => `${controller}#${permission}`);
          const before = policyCalls.length;
          const listed = await send('tools/list', {}, options);
          assert.equal(listed.status, 200);
          assert.equal(listed.body.error, undefined);
          const tools = listed.body.result.tools;
          const names = studentToolNames(tools);
          assert.deepEqual(
            names.toSorted(),
            [
              ...state.names,
              ...(token === allToken && state.permissions.includes('create')
                ? [studentCreateName]
                : []),
              ...(token === allToken && state.permissions.includes('update')
                ? [studentUpdateName]
                : []),
              ...(token === allToken && state.permissions.includes('delete')
                ? [studentDeleteName]
                : []),
            ].toSorted(),
            'scope and independent create/update/delete/select/view authority admit only exact approved Actions',
          );
          assert.deepEqual(
            policyCalls.slice(before),
            [
              ...(token === allToken ? [`${controller}#create`] : []),
              `${controller}#select`,
              `${controller}#group`,
              `${controller}#aggregate`,
              `${controller}#view`,
              ...(token === allToken ? [`${controller}#update`] : []),
              `${controller}#summary`,
              ...(token === allToken ? [`${controller}#delete`] : []),
            ],
            'each list freshly checks registered Actions in order, skipping mutations only on read scope',
          );
          const levelDescription = '1=Foundation Track; 2=Progress Track; 3=Advanced Workshop';
          for (const tool of tools) {
            if (tool.name === studentDeleteName) continue;
            assert.ok(tool.description, `${tool.name} describes its existing Action contract`);
            if ([studentCreateName, studentUpdateName].includes(tool.name)) {
              const schema = tool.inputSchema;
              const body = resolveSchema(
                tool.name === studentCreateName ? schema : schema.properties.body,
                schema.components?.schemas ?? {},
              );
              assert.equal(body.properties.level.description, levelDescription);
            }
            if ([studentViewName, studentSummaryName, studentSelectName].includes(tool.name)) {
              const schema = tool.outputSchema;
              const student =
                tool.name === studentSelectName
                  ? resolveSchema(schema.properties.list.items, schema.components?.schemas ?? {})
                  : schema;
              assert.equal(student.properties.level.description, levelDescription);
            }
          }
          const createTool = tools.find((tool: any) => tool.name === studentCreateName);
          if (createTool) {
            assert.equal(createTool.annotations.readOnlyHint, false);
            assert.notEqual(createTool.annotations.destructiveHint, false);
            assert.deepEqual(Object.keys(createTool.outputSchema.properties), ['result']);
            assert.deepEqual(createTool.outputSchema.required, ['result']);
          }
          const updateTool = tools.find((tool: any) => tool.name === studentUpdateName);
          if (updateTool) {
            assert.equal(updateTool.annotations.readOnlyHint, false);
            assert.notEqual(updateTool.annotations.destructiveHint, false);
            assert.deepEqual(Object.keys(updateTool.inputSchema.properties), ['params', 'body']);
            assert.deepEqual(updateTool.inputSchema.required, ['params', 'body']);
            assert.equal(updateTool.inputSchema.additionalProperties, false);
            assert.deepEqual(updateTool.outputSchema.properties.result, { type: 'null' });
            assert.deepEqual(updateTool.outputSchema.required, ['result']);
          }
          const deleteTool = tools.find((tool: any) => tool.name === studentDeleteName);
          if (deleteTool) {
            assert.equal(deleteTool.annotations.readOnlyHint, false);
            assert.notEqual(deleteTool.annotations.destructiveHint, false);
            assert.deepEqual(Object.keys(deleteTool.inputSchema.properties), ['id']);
            assert.deepEqual(deleteTool.inputSchema.required, ['id']);
            assert.equal(deleteTool.inputSchema.additionalProperties, false);
            assert.deepEqual(deleteTool.outputSchema.properties.result, { type: 'null' });
          }
          const studentTool = tools.find((tool: any) => tool.name === studentSummaryName);
          if (studentTool) {
            assert.deepEqual(Object.keys(studentTool.inputSchema.properties), ['id']);
            assert.deepEqual(studentTool.inputSchema.required, ['id']);
            assert.equal(studentTool.inputSchema.additionalProperties, false);
            assert.deepEqual(
              Object.keys(studentTool.outputSchema.properties).sort(),
              studentSummaryFields,
            );
            assert.deepEqual(studentTool.outputSchema.required.toSorted(), studentSummaryFields);
            assert.equal(studentTool.annotations.readOnlyHint, true);
            assert.equal(studentTool.annotations.destructiveHint, false);
            for (const field of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
              assert.equal(JSON.stringify(studentTool).includes(`"${field}"`), false);
            }
          }
          for (const spy of business) {
            assert.equal(
              spy.mock.callCount(),
              0,
              'listing never executes student work or row reads',
            );
          }
        }
        granted = [`${controller}#select`, `${controller}#view`];
        const visible = await send('tools/list', {}, options);
        assert.deepEqual(
          studentToolNames(visible.body.result.tools).toSorted(),
          [
            studentSelectName,
            studentGroupName,
            studentAggregateName,
            studentViewName,
            studentSummaryName,
          ].toSorted(),
        );
        granted = [];
        for (const [name, args] of [
          [studentSelectName, { name: 'unused', pageNo: 1, pageSize: 1 }],
          [studentGroupName, { name: 'unused' }],
          [studentAggregateName, { name: 'unused' }],
          [studentViewName, { id: '-1' }],
          [studentSummaryName, { id: '-1' }],
        ] as const) {
          const denied = await send('tools/call', { name, arguments: args }, options);
          assert.equal(denied.status, 200);
          assert.equal(denied.body.result.isError, true);
          assert.equal(denied.body.result.structuredContent, undefined);
          assert.deepEqual(denied.body.result.content, [{ type: 'text', text: 'Action failed' }]);
        }
        for (const spy of business) {
          assert.equal(
            spy.mock.callCount(),
            0,
            'revocation rejects before controller/service/model entry',
          );
        }
        granted = [`${controller}#select`, `${controller}#view`];
        broken = true;
        const failed = await send('tools/list', {}, options);
        assert.equal(failed.status, 200);
        assert.equal(failed.body.error.code, -32603);
        assert.equal(failed.body.result, undefined, 'no partial or unfiltered fallback');
        assert.equal(
          JSON.stringify(failed.body).includes('private discovery failure detail'),
          false,
        );
        broken = false;
        granted = [`${controller}#view`];
        const recovered = await send('tools/list', {}, options);
        assert.deepEqual(studentToolNames(recovered.body.result.tools), [
          studentViewName,
          studentSummaryName,
        ]);
        for (const spy of business) assert.equal(spy.mock.callCount(), 0);
      }
    } finally {
      off();
      for (const spy of business) spy.mock.restore();
    }
    const after = await send('tools/list', {}, { headers: { authorization: `Bearer ${bearer}` } });
    assert.deepEqual(studentToolNames(after.body.result.tools), [], 'test policy was removed');
  });

  it('enforces a personal custom scope exact subset through consent, Action checks and edit/delete invalidation', async t => {
    if (trainingDisabled) return;
    const { ServiceStudent } = await import('vona-module-training-student');
    let scopeId: string | undefined;
    let oauthClientId: string | undefined;
    let selectAllowed = true;
    const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
      if (
        String(app.bean.passport.currentUser?.id) !== fixtureUserId ||
        app.ctx.instanceName !== '' ||
        request.action.controllerBeanFullName !== 'training-student.controller.student'
      ) {
        return next();
      }
      assert.equal(String(app.bean.passport.currentAuth?.id), fixtureAuthId);
      return {
        allowed:
          request.policyActionKey === 'training-student.controller.student#view' ||
          (selectAllowed &&
            request.policyActionKey === 'training-student.controller.student#select'),
        actionKey: request.action.actionKey,
        action: request.action,
      };
    });
    const select = t.mock.method(ServiceStudent.prototype, 'select');
    const executor = app.bean.executor;
    const original = executor.performAction;
    const dispatched = t.mock.method(
      executor,
      'performAction',
      async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
        assert.equal(String(this.bean.passport.currentUser?.id), fixtureUserId);
        assert.equal(String(this.bean.passport.currentAuth?.id), fixtureAuthId);
        assert.equal(
          this.bean.passport.currentRoles?.some(role => role.name === 'systemAdmin'),
          false,
        );
        assert.equal(args[0], 'get');
        assert.equal(args[1], '/training/student');
        assert.equal(args[2]?.innerAccess, false);
        return await original.apply(this, args);
      },
    );
    const personal = (action: string, method = 'GET', body?: object) =>
      openHttp({
        target: app.util.combineApiPath(`/mcp/auth/customScope/${action}`, '', true, true),
        method,
        headers: { authorization: `Bearer ${browserToken}`, origin },
        body: body === undefined ? undefined : JSON.stringify(body),
      }).response;
    const options = (token: string) => ({ headers: { authorization: `Bearer ${token}` } });
    const refresh = (token: string) =>
      openHttp({
        target: '/mcp/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: oauthClientId!,
          refresh_token: token,
          resource,
        }).toString(),
      }).response;
    const assertInvalidated = async (token: { access_token: string; refresh_token?: string }) => {
      const before = dispatched.mock.callCount();
      const denied = await send(
        'tools/call',
        { name: studentSelectName, arguments: {} },
        options(token.access_token),
      );
      assert.equal(denied.status, 401);
      assert.match(String(denied.headers['www-authenticate']), /error="invalid_token"/);
      assert.equal(dispatched.mock.callCount(), before, 'invalidated bearer never dispatches');
      assert.ok(token.refresh_token);
      const rejected = await refresh(token.refresh_token);
      assert.equal(rejected.status, 400);
      assert.equal(rejected.body.error, 'invalid_grant');
      assert.equal(rejected.headers['cache-control'], 'no-store');
    };
    try {
      const catalog = await personal('catalog');
      assert.equal(catalog.status, 200, `personal scope catalog: ${JSON.stringify(catalog.body)}`);
      const tools = catalog.body.data as IMcpToolCatalogItem[];
      const selected = tools.find(tool => tool.name === studentSelectName);
      const sibling = tools.find(tool => tool.name === studentGroupName);
      const view = tools.find(tool => tool.name === studentViewName);
      assert.ok(
        selected && sibling && view,
        'catalog includes multiple independently usable reads',
      );
      assert.equal(selected.readOnly, true);
      assert.equal(selected.summary, 'List Students');
      assert.equal(sibling.summary, 'Group Students');
      assert.equal(selected.controllerSummary, 'Student Management');
      assert.equal(sibling.controllerSummary, selected.controllerSummary);
      const binding = ({ name, controller, action }: IMcpToolIdentity) => ({
        name,
        controller,
        action,
      });
      const definition = {
        name: `MCP-exact-subset-${randomUUID()}`,
        description: 'One authorized student read, not the read-tool family',
        tools: [binding(selected)],
      };
      const created = await personal('createMine', 'POST', definition);
      assert.equal(created.status, 200, `personal scope create: ${JSON.stringify(created.body)}`);
      assert.ok(created.body.data.id, 'personal scope create returns its persisted identity');
      scopeId = String(created.body.data.id);
      const scope = created.body.data.scope as TypeMcpScope;
      assert.equal(scope, `mcp:custom:${definition.name}`);
      assert.deepEqual(created.body.data.tools, definition.tools);
      assert.equal(dispatched.mock.callCount(), 0, 'catalog and scope creation execute no Actions');
      assert.equal(select.mock.callCount(), 0);
      const registration = await app.bean.executor.mockCtx(
        async () =>
          app.scope('mcp-auth').service.registration.register(
            {
              client_name: 'Managed MCP exact custom scope',
              redirect_uris: [redirectUri],
              token_endpoint_auth_method: 'none',
              grant_types: ['authorization_code', 'refresh_token'],
              response_types: ['code'],
              scope: 'mcp:all',
            },
            { resource, instanceName: '' },
          ),
        { instanceName: '' },
      );
      oauthClientId = registration.client_id;
      // The helper asserts the token response is custom, never the requested all ceiling.
      const initial = await redeemTokens('mcp:all', oauthClientId, scope);
      assert.ok(initial.refresh_token);
      const renewed = await refresh(initial.refresh_token);
      assert.equal(renewed.status, 200);
      assert.equal(renewed.body.scope, scope, 'refresh retains the exact approved subset');
      assert.ok(renewed.body.refresh_token);
      const token = renewed.body as { access_token: string; refresh_token: string };
      const listed = await send('tools/list', {}, options(token.access_token));
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name),
        [studentSelectName],
      );
      const excluded = await send(
        'tools/call',
        { name: sibling.name, arguments: {} },
        options(token.access_token),
      );
      assert.equal(excluded.status, 200);
      assert.equal(excluded.body.error?.code, -32602);
      assert.equal(excluded.body.result, undefined);
      assert.equal(dispatched.mock.callCount(), 0, 'authorized sibling is rejected predispatch');
      const query = { name: `MCP custom scope absent ${randomUUID()}`, pageNo: 1, pageSize: 1 };
      const call = () =>
        send(
          'tools/call',
          { name: studentSelectName, arguments: query },
          options(token.access_token),
        );
      assert.deepEqual(output(await call()).list, []);
      assert.equal(dispatched.mock.callCount(), 1);
      assert.equal(select.mock.callCount(), 1, 'allowed tool executes its ordinary service');
      selectAllowed = false;
      const denied = await call();
      assert.equal(denied.status, 200);
      assert.equal(denied.body.error, undefined);
      assert.equal(denied.body.result.isError, true);
      assert.equal(denied.body.result.structuredContent, undefined);
      assert.deepEqual(denied.body.result.content, [{ type: 'text', text: 'Action failed' }]);
      assert.equal(
        dispatched.mock.callCount(),
        2,
        'custom scope does not replace current Action checks',
      );
      assert.equal(select.mock.callCount(), 1, 'current permission denial prevents service work');
      selectAllowed = true;
      const edited = await personal(`updateMine/${scopeId}`, 'POST', {
        ...definition,
        tools: [binding(view)],
      });
      assert.equal(edited.status, 200, `personal scope update: ${JSON.stringify(edited.body)}`);
      assert.equal(edited.body.data.scope, scope);
      assert.deepEqual(edited.body.data.tools, [binding(view)]);
      await assertInvalidated(token);
      const replacement = await redeemTokens('mcp:all', oauthClientId, scope);
      const replacedList = await send('tools/list', {}, options(replacement.access_token));
      assert.equal(replacedList.status, 200);
      assert.deepEqual(
        replacedList.body.result.tools.map((tool: any) => tool.name),
        [studentViewName],
      );
      const deleted = await personal(`deleteMine/${scopeId}`, 'DELETE');
      assert.equal(deleted.status, 200, `personal scope delete: ${JSON.stringify(deleted.body)}`);
      await assertInvalidated(replacement);
    } finally {
      off();
      dispatched.mock.restore();
      select.mock.restore();
      await app.bean.executor.mockCtx(
        async () => {
          if (oauthClientId) {
            await app.scope('mcp-auth').model.authorization.delete({ oauthClientId });
          }
          if (scopeId) await app.scope('mcp-auth').model.customScope.deleteById(scopeId);
          if (oauthClientId) {
            await app.scope('mcp-auth').model.client.delete({ oauthClientId });
          }
        },
        { instanceName: '' },
      );
    }
  });

  it('creates one owned student aggregate only with all scope and independent current create authority', async t => {
    if (trainingDisabled) return;
    const { ServiceStudent } = await import('vona-module-training-student');
    const name = `MCP create ${randomUUID()}`;
    const recordName = `MCP create record ${randomUUID()}`;
    const subjectName = `MCP create subject ${randomUUID()}`;
    const descriptionMarkdown = `# Owned MCP create\n\n${randomUUID()}`;
    const trainingTime = new Date('2026-05-12T08:00:00.000Z');
    const studentData = {
      name,
      mobile: '13812345678',
      level: 2,
      content: { descriptionMarkdown },
      trainingRecords: [
        {
          name: recordName,
          subjectCount: 1,
          totalScore: 88,
          averageScore: 88,
          trainingTime,
          description: 'Owned MCP create record',
          trainingRecordSubjects: [
            { name: subjectName, score: 88, description: 'Owned MCP create subject' },
          ],
        },
      ],
    } as DtoStudentCreate;
    let studentId: string | undefined;
    let off = () => {};
    const allToken = await redeemBearer('mcp:all');
    const revokedToken = await redeemBearer('mcp:all');
    const observedCalls: Array<{ method: unknown; path: unknown; options: any }> = [];
    const executor = app.bean.executor;
    const original = executor.performAction;
    const observed = t.mock.method(
      executor,
      'performAction',
      async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
        observedCalls.push({ method: args[0], path: args[1], options: args[2] });
        assert.equal(String(this.bean.passport.currentUser?.id), fixtureUserId);
        assert.equal(String(this.bean.passport.currentAuth?.id), fixtureAuthId);
        assert.equal(
          this.bean.passport.currentRoles?.some(role => role.name === 'systemAdmin'),
          false,
        );
        return await original.apply(this, args);
      },
    );
    const create = t.mock.method(ServiceStudent.prototype, 'create');
    const call = (args: object = studentData, token = allToken, legacy = false) =>
      send(
        'tools/call',
        { name: studentCreateName, arguments: args },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const assertDenied = (response: Awaited<ReturnType<typeof send>>, stage: string) => {
      assert.equal(response.status, 200);
      assert.equal(response.body.error, undefined, stage);
      assert.equal(response.body.result.isError, true);
      assert.equal(response.body.result.structuredContent, undefined);
      assert.deepEqual(response.body.result.content, [{ type: 'text', text: 'Action failed' }]);
    };
    const assertOwnedCounts = async (expected: number) => {
      await app.bean.executor.mockCtx(
        async () => {
          const options = { disableDeleted: true };
          assert.equal(
            Number(
              await app.scope('training-student').model.student.count({ where: { name } }, options),
            ),
            expected,
          );
          assert.equal(
            Number(
              await app
                .scope('training-student')
                .model.studentContent.count({ where: { descriptionMarkdown } }, options),
            ),
            expected,
          );
          assert.equal(
            Number(
              await app
                .scope('training-record')
                .model.record.count({ where: { name: recordName } }, options),
            ),
            expected,
          );
          assert.equal(
            Number(
              await app
                .scope('training-recordsubject')
                .model.subject.count({ where: { name: subjectName } }, options),
            ),
            expected,
          );
        },
        { instanceName: '' },
      );
    };
    try {
      // Broader OAuth scope is not an ordinary business permission.
      assertDenied(await call(), 'create without current create permission');
      for (const action of ['select', 'view'] as const) {
        off();
        off = allowStudentAction(action);
        assertDenied(await call(), 'create without current create permission');
      }
      assert.equal(create.mock.callCount(), 0, 'select and view cannot enter create service');
      await assertOwnedCounts(0);
      off();
      off = allowStudentAction('create');
      for (const legacy of [false, true]) {
        const beforeList = create.mock.callCount();
        const listed = await send(
          'tools/list',
          {},
          {
            legacy,
            headers: { authorization: `Bearer ${allToken}` },
          },
        );
        assert.deepEqual(studentToolNames(listed.body.result.tools), [studentCreateName]);
        assert.equal(
          create.mock.callCount(),
          beforeList,
          'create discovery is never a trial write',
        );
        const readOptions = { legacy, headers: { authorization: `Bearer ${bearer}` } };
        const readList = await send('tools/list', {}, readOptions);
        assert.deepEqual(
          studentToolNames(readList.body.result.tools),
          [],
          'read scope hides even authorized create',
        );
        const before = observedCalls.length;
        const denied = await call(studentData, bearer, legacy);
        assert.equal(denied.status, 200);
        assert.equal(denied.body.error?.code, -32602);
        assert.equal(denied.body.result, undefined);
        assert.equal(observedCalls.length, before, 'read scope rejects create before dispatch');
        for (const args of [
          { ...studentData, extra: true },
          { ...studentData, mobile: {} },
          { ...studentData, innerAccess: true },
          {
            ...studentData,
            trainingRecords: [
              {
                name: recordName,
                trainingRecordSubjects: [{ name: subjectName, score: 95, id: '123' }],
              },
            ],
          },
          {
            ...studentData,
            trainingRecords: [
              {
                name: recordName,
                trainingTime: 'not-a-date',
                trainingRecordSubjects: [{ name: subjectName, score: 95 }],
              },
            ],
          },
        ]) {
          const invalid = await call(args, allToken, legacy);
          assert.equal(invalid.status, 200);
          assert.equal(invalid.body.error?.code, -32602);
          assert.equal(invalid.body.result, undefined);
        }
        assert.equal(observedCalls.length, before, 'invalid create arguments fail before dispatch');
        for (const [toolName, args] of [
          [studentSelectName, { name, pageNo: 1, pageSize: 1 }],
          [studentViewName, { id: '-1' }],
        ] as const) {
          assertDenied(
            await send(
              'tools/call',
              { name: toolName, arguments: args },
              {
                legacy,
                headers: { authorization: `Bearer ${allToken}` },
              },
            ),
            `create-only authority calling ${toolName}`,
          );
        }
      }
      await assertOwnedCounts(0);
      // A previously listed create is independently reauthorized at call time.
      off();
      off = allowStudentAction('view');
      assertDenied(await call(), 'create without current create permission');
      assert.equal(create.mock.callCount(), 0, 'revoked create permission performs no write');
      await assertOwnedCounts(0);
      off();
      off = allowStudentAction('create');
      await app.bean.executor.mockCtx(
        async () => {
          await app.scope('mcp-auth').service.authorization.revoke(revokedToken);
        },
        { instanceName: '' },
      );
      const beforeRevoked = observedCalls.length;
      const revoked = await call(studentData, revokedToken);
      assert.equal(revoked.status, 401);
      assert.equal(observedCalls.length, beforeRevoked, 'revoked bearer cannot dispatch create');
      assert.equal(create.mock.callCount(), 0);
      await assertOwnedCounts(0);

      const response = await call();
      const identity = response.body?.result?.structuredContent?.result;
      if (typeof identity === 'string' || typeof identity === 'number')
        studentId = String(identity);
      // Capture ownership before validating either response channel; finally also covers a lost response.
      const created = output(response);
      assert.ok(studentId);
      assert.deepEqual(created, { result: studentId });
      assert.equal(create.mock.callCount(), 1, 'exactly one aggregate create is executed');
      const dispatched = observedCalls.at(-1)!;
      assert.equal(dispatched.method, 'post');
      assert.equal(dispatched.path, '/training/student');
      assert.deepEqual(Object.keys(dispatched.options).sort(), ['body', 'innerAccess']);
      assert.equal(dispatched.options.innerAccess, false);
      assert.deepEqual(dispatched.options.body, studentData);
      await assertOwnedCounts(1);
      await app.bean.executor.mockCtx(
        async () => {
          const training = app.scope('training-student');
          const student = await training.service.student.view(studentId!);
          assert.ok(student);
          assert.equal(String(student.id), studentId);
          assert.equal(student.name, name);
          assert.equal(student.mobile, studentData.mobile);
          assert.equal(student.level, studentData.level);
          assert.equal(student.content?.descriptionMarkdown, descriptionMarkdown);
          assert.equal(student.trainingRecords?.length, 1);
          const record = student.trainingRecords![0];
          assert.equal(record.name, recordName);
          assert.equal(record.subjectCount, 1);
          assert.equal(record.totalScore, 88);
          assert.equal(Number(record.averageScore), 88);
          assert.equal(new Date(record.trainingTime!).toISOString(), trainingTime.toISOString());
          assert.equal(record.description, 'Owned MCP create record');
          const recordWithSubjects = await app
            .scope('training-record')
            .model.record.getById(record.id, { include: { trainingRecordSubjects: true } });
          assert.ok(recordWithSubjects);
          assert.equal(recordWithSubjects.trainingRecordSubjects.length, 1);
          const subject = recordWithSubjects.trainingRecordSubjects[0];
          assert.equal(subject.name, subjectName);
          assert.equal(subject.score, 88);
          assert.equal(subject.description, 'Owned MCP create subject');
          const content = await training.model.studentContent.get({ studentId: studentId! });
          assert.equal(content?.descriptionMarkdown, descriptionMarkdown);
          assert.equal(content?.descriptionHtml, app.bean.markdown.renderHtml(descriptionMarkdown));
        },
        { instanceName: '' },
      );
      await app.bean.executor.mockCtx(
        async () => {
          const training = app.scope('training-student');
          assert.equal(await training.service.student.view(studentId!), undefined);
          assert.equal(await training.model.student.get({ name }), undefined);
          assert.equal(
            await training.model.studentContent.get({ studentId: studentId! }),
            undefined,
          );
          assert.equal(
            await app.scope('training-record').model.record.get({ name: recordName }),
            undefined,
          );
          assert.equal(
            await app.scope('training-recordsubject').model.subject.get({ name: subjectName }),
            undefined,
          );
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      off();
      try {
        await app.bean.executor.mockCtx(
          async () => {
            const training = app.scope('training-student');
            const ids = new Set(studentId ? [studentId] : []);
            // Exact test-owned name fallback covers a committed write whose response failed.
            const owned = await training.model.student.select(
              { where: { name } },
              { disableDeleted: true },
            );
            for (const student of owned) {
              if (student.id) ids.add(String(student.id));
            }
            for (const id of ids) await training.service.student.deleteForce(id);
          },
          { instanceName: '' },
        );
      } finally {
        create.mock.restore();
        observed.mock.restore();
      }
    }
  });

  it('creates a basic-fields-only student, updates its root and independently authorizes serialized MCP view', async () => {
    if (trainingDisabled) return;
    const suffix = randomUUID();
    const studentData = {
      name: `MCP basic ${suffix}`,
      mobile: '13812345678',
      level: 1,
    };
    const body = {
      name: `MCP basic updated ${suffix}`,
      mobile: studentData.mobile,
      level: studentData.level,
    };
    const allToken = await redeemBearer('mcp:all');
    let studentId: string | undefined;
    const contentIds = new Set<string>();
    let off = () => {};
    try {
      off = allowStudentAction('create');
      const response = await send(
        'tools/call',
        { name: studentCreateName, arguments: studentData },
        { headers: { authorization: `Bearer ${allToken}` } },
      );
      const identity = response.body?.result?.structuredContent?.result;
      if (typeof identity === 'string' || typeof identity === 'number')
        studentId = String(identity);
      // Capture ownership before either output channel is validated.
      const created = output(response);
      assert.ok(studentId);
      assert.deepEqual(created, { result: studentId });

      off();
      off = allowStudentAction('update');
      assert.deepEqual(
        output(
          await send(
            'tools/call',
            { name: studentUpdateName, arguments: { params: { id: studentId }, body } },
            { headers: { authorization: `Bearer ${allToken}` } },
          ),
        ),
        { result: null },
      );

      // Mutation authority never supplies the independent read-back grant.
      off();
      off = allowStudentAction('view');
      const student = output(
        await send(
          'tools/call',
          { name: studentViewName, arguments: { id: studentId } },
          { headers: { authorization: `Bearer ${bearer}` } },
        ),
      );
      assert.equal(student.id, studentId);
      assert.equal(student.name, body.name);
      assert.equal(student.level, body.level);
      assert.equal(student.mobile, '138****5678');
      // Existing response parsing omits optional empty strings from JSON.
      assert.equal(Object.hasOwn(student.content, 'descriptionMarkdown'), false);
      assert.deepEqual(student.trainingRecords, []);
    } finally {
      off();
      await app.bean.executor.mockCtx(
        async () => {
          const training = app.scope('training-student');
          const ids = new Set(studentId ? [studentId] : []);
          if (!studentId) {
            // Exact owned-name recovery covers create committing before its response fails.
            const owned = await training.model.student.select(
              { where: { name: studentData.name } },
              { disableDeleted: true },
            );
            for (const student of owned) {
              if (student.id) ids.add(String(student.id));
            }
          }
          for (const id of ids) {
            const contents = await training.model.studentContent.select(
              { where: { studentId: id } },
              { disableDeleted: true },
            );
            for (const content of contents) contentIds.add(String(content.id));
          }
          for (const id of contentIds) {
            await training.model.studentContent.deleteById(id, { disableDeleted: true });
          }
          for (const id of ids) {
            await training.model.student.deleteById(id, { disableDeleted: true });
          }
        },
        { instanceName: '' },
      );
    }
  });

  it('updates an owned aggregate through guarded PATCH and authorized view without crossing root or child ownership', async t => {
    if (trainingDisabled) return;
    const { ModelStudent, ModelStudentContent, ServiceStudent } =
      await import('vona-module-training-student');
    const { ModelRecord } = await import('vona-module-training-record');
    const { ModelSubject } = await import('vona-module-training-recordsubject');
    const allToken = await redeemBearer('mcp:all');
    const revokedToken = await redeemBearer('mcp:all');
    const suffix = randomUUID();
    const descriptionMarkdown = `# Owned MCP update\n\n${suffix}`;
    const trainingTime = new Date('2026-06-15T09:30:00.000Z');
    type OwnedAggregate = {
      name: string;
      instanceName: '' | 'shareTest';
      id?: string;
      contentIds: Set<string>;
      recordIds: Set<string>;
      subjectIds: Set<string>;
    };
    const owned: OwnedAggregate[] = [];
    const own = (label: string, instanceName: OwnedAggregate['instanceName'] = '') => {
      const fixture: OwnedAggregate = {
        name: `MCP update ${label} ${suffix}`,
        instanceName,
        contentIds: new Set(),
        recordIds: new Set(),
        subjectIds: new Set(),
      };
      owned.push(fixture);
      return fixture;
    };
    const target = own('target');
    const protectedRoot = own('protected');
    const deletedRoot = own('deleted');
    const missingRoot = own('missing');
    const foreignRoot = own('foreign', 'shareTest');
    const collectOwned = async (fixture: OwnedAggregate) => {
      const training = app.scope('training-student');
      if (!fixture.id) {
        // Only recover this exact owned name if create committed before returning an ID.
        const roots = await training.model.student.select(
          { where: { name: fixture.name } },
          { disableDeleted: true },
        );
        assert.ok(roots.length <= 1);
        if (roots[0]) fixture.id = String(roots[0].id);
      }
      if (!fixture.id) return;
      const contents = await training.model.studentContent.select(
        { where: { studentId: fixture.id } },
        { disableDeleted: true },
      );
      for (const content of contents) fixture.contentIds.add(String(content.id));
      const records = await app
        .scope('training-record')
        .model.record.select({ where: { studentId: fixture.id } }, { disableDeleted: true });
      for (const record of records) fixture.recordIds.add(String(record.id));
      for (const recordId of fixture.recordIds) {
        const subjects = await app
          .scope('training-recordsubject')
          .model.subject.select({ where: { recordId } }, { disableDeleted: true });
        for (const subject of subjects) fixture.subjectIds.add(String(subject.id));
      }
    };
    const createOwned = async (fixture: OwnedAggregate, multiple = false) =>
      app.bean.executor.mockCtx(
        async () => {
          const student = await app.scope('training-student').service.student.create({
            name: fixture.name,
            mobile: '13812345678',
            level: 1,
            content: { descriptionMarkdown: `Original ${fixture.name}` },
            trainingRecords: [
              {
                name: `${fixture.name} record`,
                trainingTime: new Date('2026-05-10T08:00:00.000Z'),
                trainingRecordSubjects: [
                  { name: `${fixture.name} subject`, score: 70 },
                  ...(multiple ? [{ name: `${fixture.name} removed subject`, score: 60 }] : []),
                ],
              },
              ...(multiple
                ? [
                    {
                      name: `${fixture.name} removed record`,
                      trainingRecordSubjects: [{ name: `${fixture.name} descendant`, score: 50 }],
                    },
                  ]
                : []),
            ],
          } as DtoStudentCreate);
          fixture.id = String(student.id);
          await collectOwned(fixture);
          return await app.scope('training-student').model.student.getById(fixture.id, {
            include: {
              content: true,
              trainingRecords: { include: { trainingRecordSubjects: true } },
            },
          });
        },
        { instanceName: fixture.instanceName as any },
      );
    const snapshot = (fixture: OwnedAggregate) =>
      app.bean.executor.mockCtx(
        async () => {
          await collectOwned(fixture);
          return {
            root: await app.scope('training-student').model.student.getById(fixture.id!, {
              disableDeleted: true,
            }),
            content: await app
              .scope('training-student')
              .model.studentContent.select(
                { where: { studentId: fixture.id! }, orders: [['id', 'asc']] },
                { disableDeleted: true },
              ),
            records: await app
              .scope('training-record')
              .model.record.select(
                { where: { studentId: fixture.id! }, orders: [['id', 'asc']] },
                { disableDeleted: true },
              ),
            subjects: await app
              .scope('training-recordsubject')
              .model.subject.select(
                { where: { recordId: [...fixture.recordIds] }, orders: [['id', 'asc']] },
                { disableDeleted: true },
              ),
          };
        },
        { instanceName: fixture.instanceName as any },
      );
    let off = () => {};
    const observedCalls: Array<{ method: unknown; path: unknown; options: any; result?: unknown }> =
      [];
    const spies: Array<{ mock: { restore(): void } }> = [];
    try {
      const initial = await createOwned(target, true);
      const protectedStudent = await createOwned(protectedRoot);
      await createOwned(deletedRoot);
      await createOwned(missingRoot);
      await app.bean.executor.mockCtx(
        async () => app.scope('training-student').service.student.deleteForce(missingRoot.id!),
        { instanceName: '' },
      );
      await createOwned(foreignRoot);
      assert.ok(initial && protectedStudent);
      const record = initial.trainingRecords!.find(item => item.name === `${target.name} record`)!;
      const removedRecord = initial.trainingRecords!.find(
        item => item.name === `${target.name} removed record`,
      )!;
      const subject = record.trainingRecordSubjects!.find(
        item => item.name === `${target.name} subject`,
      )!;
      const removedSubject = record.trainingRecordSubjects!.find(
        item => item.name === `${target.name} removed subject`,
      )!;
      const protectedRecord = protectedStudent.trainingRecords![0];
      const protectedSubject = protectedRecord.trainingRecordSubjects![0];
      await app.bean.executor.mockCtx(
        async () => app.scope('training-student').service.student.delete(deletedRoot.id!),
        { instanceName: '' },
      );
      const protectedBefore = await snapshot(protectedRoot);
      const deletedBefore = await snapshot(deletedRoot);
      const foreignBefore = await snapshot(foreignRoot);
      const targetBefore = await snapshot(target);
      const body = {
        name: `MCP updated ${suffix}`,
        mobile: '13987654321',
        level: 3,
        content: { descriptionMarkdown },
        trainingRecords: [
          {
            id: record.id,
            name: `MCP updated record ${suffix}`,
            subjectCount: 2,
            totalScore: 185,
            averageScore: 92.5,
            trainingTime,
            description: 'Updated existing MCP record',
            trainingRecordSubjects: [
              { id: subject.id, name: `MCP updated subject ${suffix}`, score: 96 },
              { name: `MCP new subject ${suffix}`, score: 89 },
              // Deletion controls do not waive the declared required business fields.
              { id: removedSubject.id, deleted: true, name: removedSubject.name, score: 60 },
            ],
          },
          {
            name: `MCP new record ${suffix}`,
            trainingTime,
            trainingRecordSubjects: [{ name: `MCP new record subject ${suffix}`, score: 91 }],
          },
          { id: removedRecord.id, deleted: true, name: removedRecord.name },
        ],
      } as DtoStudentUpdate;
      const args = { params: { id: target.id! }, body };
      const executor = app.bean.executor;
      const original = executor.performAction;
      const observed = t.mock.method(
        executor,
        'performAction',
        async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
          const call: (typeof observedCalls)[number] = {
            method: args[0],
            path: args[1],
            options: args[2],
          };
          observedCalls.push(call);
          assert.equal(String(this.bean.passport.currentUser?.id), fixtureUserId);
          assert.equal(String(this.bean.passport.currentAuth?.id), fixtureAuthId);
          assert.equal(
            this.bean.passport.currentRoles?.some(role => role.name === 'systemAdmin'),
            false,
          );
          call.result = await original.apply(this, args);
          return call.result as Awaited<ReturnType<BeanExecutor['performAction']>>;
        },
      );
      spies.push(observed);
      const update = t.mock.method(ServiceStudent.prototype, 'update');
      spies.push(update);
      const writes = [
        t.mock.method(ModelStudent.prototype, 'update'),
        t.mock.method(ModelStudentContent.prototype, 'mutateBulk'),
        t.mock.method(ModelRecord.prototype, 'mutateBulk'),
        t.mock.method(ModelSubject.prototype, 'mutateBulk'),
      ];
      spies.push(...writes);
      const writeCounts = () => writes.map(spy => spy.mock.callCount());
      const call = (input: object = args, token = allToken, legacy = false) =>
        send(
          'tools/call',
          { name: studentUpdateName, arguments: input },
          { legacy, headers: { authorization: `Bearer ${token}` } },
        );
      const list = (token = allToken, legacy = false) =>
        send('tools/list', {}, { legacy, headers: { authorization: `Bearer ${token}` } });
      const assertDenied = (response: Awaited<ReturnType<typeof send>>) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.error, undefined);
        assert.equal(response.body.result.isError, true);
        assert.equal(response.body.result.structuredContent, undefined);
        assert.deepEqual(response.body.result.content, [{ type: 'text', text: 'Action failed' }]);
      };
      const assertNull = (response: Awaited<ReturnType<typeof send>>) => {
        assert.deepEqual(output(response), { result: null });
        const dispatched = observedCalls.at(-1)!;
        assert.equal(dispatched.method, 'patch');
        assert.equal(dispatched.path, '/training/student/:id');
        assert.equal(
          dispatched.result,
          null,
          'real Action executor unwraps void completion to null',
        );
        assert.deepEqual(Object.keys(dispatched.options).sort(), ['body', 'innerAccess', 'params']);
        assert.equal(dispatched.options.innerAccess, false);
      };
      assertDenied(await call());
      for (const action of ['create', 'select', 'view'] as const) {
        off();
        off = allowStudentAction(action);
        assertDenied(await call());
      }
      assert.equal(update.mock.callCount(), 0, 'create/select/view never grant update');
      assert.deepEqual(writeCounts(), [0, 0, 0, 0]);
      assert.deepEqual(await snapshot(target), targetBefore);
      off();
      off = allowStudentAction('update');
      for (const legacy of [false, true]) {
        const listed = await list(allToken, legacy);
        assert.equal(listed.status, 200);
        assert.deepEqual(studentToolNames(listed.body.result.tools), [studentUpdateName]);
        assert.deepEqual(studentToolNames((await list(bearer, legacy)).body.result.tools), []);
        const before = observedCalls.length;
        const readDenied = await call(args, bearer, legacy);
        assert.equal(readDenied.status, 200);
        assert.equal(readDenied.body.error?.code, -32602);
        assert.equal(readDenied.body.result, undefined);
        for (const input of [
          body,
          { body },
          { ...args, extra: true },
          { ...args, innerAccess: true },
          { params: { id: target.id, instanceName: 'shareTest' }, body },
          { params: { id: {} }, body },
          { params: args.params, body: { mobile: body.mobile, level: body.level } },
          { params: args.params, body: { name: body.name, level: body.level } },
          { params: args.params, body: { name: body.name, mobile: body.mobile } },
          { ...args, body: { ...body, extra: true } },
          { ...args, body: { ...body, content: { descriptionMarkdown, studentId: target.id } } },
          {
            ...args,
            body: { ...body, trainingRecords: [{ name: record.name, studentId: target.id }] },
          },
          {
            ...args,
            body: {
              ...body,
              trainingRecords: [{ name: record.name, trainingTime: 'not-a-date' }],
            },
          },
          {
            ...args,
            body: {
              ...body,
              trainingRecords: [
                {
                  name: record.name,
                  trainingRecordSubjects: [{ name: subject.name, score: 80, recordId: record.id }],
                },
              ],
            },
          },
        ]) {
          const invalid = await call(input, allToken, legacy);
          assert.equal(invalid.status, 200);
          assert.equal(invalid.body.error?.code, -32602);
          assert.equal(invalid.body.result, undefined);
        }
        assert.equal(
          observedCalls.length,
          before,
          'read scope and malformed updates fail predispatch',
        );
      }
      assert.equal(update.mock.callCount(), 0, 'discovery never invokes the update service');
      assert.deepEqual(writeCounts(), [0, 0, 0, 0]);
      assert.deepEqual(await snapshot(target), targetBefore);
      // A listed tool grants no durable authority: both business permission and token are current.
      off();
      off = allowStudentAction('view');
      assertDenied(await call());
      assert.equal(update.mock.callCount(), 0);
      assert.deepEqual(await snapshot(target), targetBefore);
      off();
      off = allowStudentAction('update');
      assert.deepEqual(studentToolNames((await list(revokedToken)).body.result.tools), [
        studentUpdateName,
      ]);
      await app.bean.executor.mockCtx(
        async () => app.scope('mcp-auth').service.authorization.revoke(revokedToken),
        { instanceName: '' },
      );
      const beforeRevoked = observedCalls.length;
      assert.equal((await call(args, revokedToken)).status, 401);
      assert.equal(observedCalls.length, beforeRevoked);
      assert.equal(update.mock.callCount(), 0);
      assert.deepEqual(writeCounts(), [0, 0, 0, 0]);
      assert.deepEqual(await snapshot(target), targetBefore);

      assertNull(await call());
      assert.equal(
        update.mock.callCount(),
        1,
        'one successful aggregate mutation, not automatic replay',
      );
      const dispatched = observedCalls.at(-1)!;
      assert.deepEqual(dispatched.options.params, args.params);
      assert.deepEqual(dispatched.options.body, {
        ...body,
        content: { deleted: false, ...body.content },
        trainingRecords: body.trainingRecords!.map(record => ({
          deleted: false,
          ...record,
          ...(record.id !== undefined ? { id: String(record.id) } : {}),
          ...(record.trainingRecordSubjects
            ? {
                trainingRecordSubjects: record.trainingRecordSubjects.map(subject => ({
                  deleted: false,
                  ...subject,
                  ...(subject.id !== undefined ? { id: String(subject.id) } : {}),
                })),
              }
            : {}),
        })),
      });
      assert.ok(dispatched.options.body.trainingRecords[0].trainingTime instanceof Date);
      assert.ok(
        update.mock.calls.at(-1)!.arguments[1].trainingRecords![0].trainingTime instanceof Date,
      );
      // Legacy uses the same guarded PATCH, without replaying the id-less nested inserts.
      const rootBody = { name: body.name, mobile: body.mobile, level: body.level };
      assertNull(await call({ params: args.params, body: rootBody }, allToken, true));
      assert.equal(update.mock.callCount(), 2);
      // Update does not silently grant read-back authority.
      assertDenied(
        await send(
          'tools/call',
          { name: studentViewName, arguments: { id: target.id } },
          {
            headers: { authorization: `Bearer ${allToken}` },
          },
        ),
      );
      off();
      off = allowStudentAction('view');
      for (const legacy of [false, true]) {
        const student = output(
          await send(
            'tools/call',
            { name: studentViewName, arguments: { id: target.id } },
            {
              legacy,
              headers: { authorization: `Bearer ${bearer}` },
            },
          ),
        );
        assert.equal(student.id, target.id);
        assert.equal(student.name, body.name);
        assert.equal(student.mobile, '139****4321');
        assert.equal(student.level, body.level);
        assert.equal(student.content.descriptionMarkdown, descriptionMarkdown);
        assert.equal(student.trainingRecords.length, 2);
        const updated = student.trainingRecords.find(
          (item: any) => String(item.id) === String(record.id),
        );
        const added = student.trainingRecords.find(
          (item: any) => item.name === `MCP new record ${suffix}`,
        );
        assert.ok(updated && added);
        assert.equal(updated.name, `MCP updated record ${suffix}`);
        assert.equal(updated.subjectCount, 2);
        assert.equal(updated.totalScore, 185);
        assert.equal(updated.averageScore, 92.5);
        assert.equal(updated.description, 'Updated existing MCP record');
        for (const item of [updated, added]) {
          assert.ok(item.trainingTime instanceof Date);
          assert.equal(item.trainingTime.toISOString(), trainingTime.toISOString());
        }
        assert.deepEqual(
          updated.trainingRecordSubjects.map((item: any) => [item.name, item.score]).toSorted(),
          [
            [`MCP updated subject ${suffix}`, 96],
            [`MCP new subject ${suffix}`, 89],
          ].toSorted(),
        );
        assert.equal(
          updated.trainingRecordSubjects.find((item: any) => String(item.id) === String(subject.id))
            ?.score,
          96,
        );
        assert.deepEqual(
          added.trainingRecordSubjects.map((item: any) => [item.name, item.score]),
          [[`MCP new record subject ${suffix}`, 91]],
        );
      }
      const afterUpdate = await snapshot(target);
      const descriptionHtml = await app.bean.executor.mockCtx(
        async () => app.bean.markdown.renderHtml(descriptionMarkdown),
        { instanceName: '' },
      );
      assert.equal(afterUpdate.content[0].descriptionHtml, descriptionHtml);
      assert.equal(
        afterUpdate.records.find(item => String(item.id) === String(removedRecord.id))?.deleted,
        true,
      );
      assert.equal(
        afterUpdate.subjects.find(item => String(item.id) === String(removedSubject.id))?.deleted,
        true,
      );
      for (const id of target.subjectIds) {
        const descendant = afterUpdate.subjects.find(item => String(item.id) === id);
        if (descendant && String(descendant.recordId) === String(removedRecord.id))
          assert.equal(descendant.deleted, true, 'record deletion includes its owned subjects');
      }
      off();
      off = allowStudentAction('update');
      // Null acknowledges completion, not existence. Admission must precede every nested write.
      for (const id of [missingRoot.id!, deletedRoot.id!, foreignRoot.id!]) {
        const counts = writeCounts();
        const absentBody = {
          ...rootBody,
          content: { descriptionMarkdown: `Absent root ${suffix}` },
          trainingRecords: [
            {
              name: `Absent record ${suffix}`,
              trainingRecordSubjects: [{ name: `Absent subject ${suffix}`, score: 80 }],
            },
          ],
        };
        assertNull(await call({ params: { id }, body: absentBody }));
        assert.deepEqual(
          writeCounts(),
          counts,
          'absent/deleted/foreign root cannot enter relation mutation',
        );
        await app.bean.executor.mockCtx(
          async () => {
            assert.equal(
              Number(
                await app
                  .scope('training-student')
                  .model.studentContent.count(
                    { where: { studentId: id } },
                    { disableDeleted: true },
                  ),
              ),
              id === deletedRoot.id ? deletedBefore.content.length : 0,
            );
            assert.equal(
              Number(
                await app
                  .scope('training-record')
                  .model.record.count(
                    { where: { name: `Absent record ${suffix}` } },
                    { disableDeleted: true },
                  ),
              ),
              0,
            );
            assert.equal(
              Number(
                await app
                  .scope('training-recordsubject')
                  .model.subject.count(
                    { where: { name: `Absent subject ${suffix}` } },
                    { disableDeleted: true },
                  ),
              ),
              0,
            );
          },
          { instanceName: '' },
        );
      }
      assert.deepEqual(await snapshot(deletedRoot), deletedBefore);
      assert.deepEqual(await snapshot(foreignRoot), foreignBefore);
      for (const nested of [
        [{ id: protectedRecord.id, name: 'Wrong-parent record' }],
        [{ id: protectedRecord.id, name: protectedRecord.name, deleted: true }],
        [
          {
            id: record.id,
            name: `MCP updated record ${suffix}`,
            trainingRecordSubjects: [
              { id: protectedSubject.id, name: 'Wrong-parent subject', score: 1 },
            ],
          },
        ],
        [
          {
            id: record.id,
            name: `MCP updated record ${suffix}`,
            trainingRecordSubjects: [
              { id: protectedSubject.id, name: protectedSubject.name, score: 70, deleted: true },
            ],
          },
        ],
      ]) {
        assertDenied(
          await call({ params: args.params, body: { ...rootBody, trainingRecords: nested } }),
        );
        assert.deepEqual(
          await snapshot(protectedRoot),
          protectedBefore,
          'wrong-parent child identity cannot update, delete or reparent protected rows',
        );
        // The target may already have been written: this is not a rollback/atomicity assertion.
      }
    } finally {
      off();
      try {
        // Continue precise reverse-dependency cleanup even if another owned aggregate fails.
        const failures: unknown[] = [];
        for (const fixture of owned.toReversed()) {
          try {
            await app.bean.executor.mockCtx(
              async () => {
                await collectOwned(fixture);
                for (const id of fixture.subjectIds) {
                  await app
                    .scope('training-recordsubject')
                    .model.subject.deleteById(id, { disableDeleted: true });
                }
                for (const id of fixture.recordIds) {
                  await app
                    .scope('training-record')
                    .model.record.deleteById(id, { disableDeleted: true });
                }
                for (const id of fixture.contentIds) {
                  await app
                    .scope('training-student')
                    .model.studentContent.deleteById(id, { disableDeleted: true });
                }
                if (fixture.id) {
                  await app
                    .scope('training-student')
                    .model.student.deleteById(fixture.id, { disableDeleted: true });
                }
              },
              { instanceName: fixture.instanceName as any },
            );
          } catch (error) {
            failures.push(error);
          }
        }
        assert.deepEqual(failures, [], 'Owned MCP update cleanup failed');
      } finally {
        for (const spy of spies.toReversed()) spy.mock.restore();
      }
    }
  });

  it('soft-deletes one owned aggregate through guarded DELETE with independent current delete authority', async t => {
    if (trainingDisabled) return;
    const { ServiceStudent } = await import('vona-module-training-student');
    const allToken = await redeemBearer('mcp:all');
    const revokedToken = await redeemBearer('mcp:all');
    const suffix = randomUUID();
    type OwnedAggregate = {
      name: string;
      instanceName: '' | 'shareTest';
      id?: string;
      contentIds: Set<string>;
      recordIds: Set<string>;
      subjectIds: Set<string>;
    };
    const owned: OwnedAggregate[] = [];
    const own = (label: string, instanceName: OwnedAggregate['instanceName'] = '') => {
      const fixture: OwnedAggregate = {
        name: `MCP delete ${label} ${suffix}`,
        instanceName,
        contentIds: new Set(),
        recordIds: new Set(),
        subjectIds: new Set(),
      };
      owned.push(fixture);
      return fixture;
    };
    const target = own('target');
    const unrelated = own('unrelated');
    const missing = own('missing');
    const foreign = own('foreign', 'shareTest');
    const collectOwned = async (fixture: OwnedAggregate) => {
      const training = app.scope('training-student');
      if (!fixture.id) {
        // Recover only this owned name if aggregate creation committed before returning its ID.
        const roots = await training.model.student.select(
          { where: { name: fixture.name } },
          { disableDeleted: true },
        );
        assert.ok(roots.length <= 1);
        if (roots[0]) fixture.id = String(roots[0].id);
      }
      if (!fixture.id) return;
      const contents = await training.model.studentContent.select(
        { where: { studentId: fixture.id } },
        { disableDeleted: true },
      );
      for (const content of contents) fixture.contentIds.add(String(content.id));
      const records = await app
        .scope('training-record')
        .model.record.select({ where: { studentId: fixture.id } }, { disableDeleted: true });
      for (const record of records) fixture.recordIds.add(String(record.id));
      for (const recordId of fixture.recordIds) {
        const subjects = await app
          .scope('training-recordsubject')
          .model.subject.select({ where: { recordId } }, { disableDeleted: true });
        for (const subject of subjects) fixture.subjectIds.add(String(subject.id));
      }
    };
    const createOwned = (fixture: OwnedAggregate) =>
      app.bean.executor.mockCtx(
        async () => {
          const student = await app.scope('training-student').service.student.create({
            name: fixture.name,
            mobile: '13812345678',
            level: 1,
            content: { descriptionMarkdown: `Owned ${fixture.name}` },
            trainingRecords: [
              {
                name: `${fixture.name} record`,
                trainingTime: new Date('2026-06-15T09:30:00.000Z'),
                trainingRecordSubjects: [{ name: `${fixture.name} subject`, score: 80 }],
              },
            ],
          } as DtoStudentCreate);
          fixture.id = String(student.id);
          await collectOwned(fixture);
        },
        { instanceName: fixture.instanceName as any },
      );
    const snapshot = (fixture: OwnedAggregate) =>
      app.bean.executor.mockCtx(
        async () => {
          await collectOwned(fixture);
          return {
            root: await app.scope('training-student').model.student.getById(fixture.id!, {
              disableDeleted: true,
            }),
            content: await app
              .scope('training-student')
              .model.studentContent.select(
                { where: { studentId: fixture.id! }, orders: [['id', 'asc']] },
                { disableDeleted: true },
              ),
            records: await app
              .scope('training-record')
              .model.record.select(
                { where: { studentId: fixture.id! }, orders: [['id', 'asc']] },
                { disableDeleted: true },
              ),
            subjects: await app
              .scope('training-recordsubject')
              .model.subject.select(
                { where: { recordId: [...fixture.recordIds] }, orders: [['id', 'asc']] },
                { disableDeleted: true },
              ),
          };
        },
        { instanceName: fixture.instanceName as any },
      );
    let off = () => {};
    const spies: Array<{ mock: { restore(): void } }> = [];
    try {
      for (const fixture of owned) await createOwned(fixture);
      await app.bean.executor.mockCtx(
        async () => app.scope('training-student').service.student.deleteForce(missing.id!),
        { instanceName: '' },
      );
      const targetBefore = await snapshot(target);
      const unrelatedBefore = await snapshot(unrelated);
      const foreignBefore = await snapshot(foreign);
      const missingBefore = await snapshot(missing);
      assert.equal(missingBefore.root, undefined);
      assert.deepEqual(missingBefore.content, []);
      assert.deepEqual(missingBefore.records, []);
      assert.deepEqual(missingBefore.subjects, []);
      assert.ok(targetBefore.root);
      assert.equal(targetBefore.root.deleted, false);
      for (const rows of [targetBefore.content, targetBefore.records, targetBefore.subjects]) {
        assert.equal(rows.length, 1, 'the owned target has each aggregate relation');
        assert.equal(rows[0].deleted, false);
      }
      const observedCalls: Array<{
        method: unknown;
        path: unknown;
        options: any;
        result?: unknown;
      }> = [];
      const executor = app.bean.executor;
      const original = executor.performAction;
      const observed = t.mock.method(
        executor,
        'performAction',
        async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
          const call: (typeof observedCalls)[number] = {
            method: args[0],
            path: args[1],
            options: args[2],
          };
          observedCalls.push(call);
          assert.equal(String(this.bean.passport.currentUser?.id), fixtureUserId);
          assert.equal(String(this.bean.passport.currentAuth?.id), fixtureAuthId);
          assert.equal(
            this.bean.passport.currentRoles?.some(role => role.name === 'systemAdmin'),
            false,
          );
          call.result = await original.apply(this, args);
          return call.result as Awaited<ReturnType<BeanExecutor['performAction']>>;
        },
      );
      spies.push(observed);
      const deletion = t.mock.method(ServiceStudent.prototype, 'delete');
      spies.push(deletion);
      const call = (args: object = { id: target.id! }, token = allToken, legacy = false) =>
        send(
          'tools/call',
          { name: studentDeleteName, arguments: args },
          { legacy, headers: { authorization: `Bearer ${token}` } },
        );
      const list = (token = allToken) =>
        send('tools/list', {}, { headers: { authorization: `Bearer ${token}` } });
      const assertDenied = (response: Awaited<ReturnType<typeof send>>, text = 'Action failed') => {
        assert.equal(response.status, 200);
        assert.equal(response.body.error, undefined);
        assert.equal(response.body.result.isError, true);
        assert.equal(response.body.result.structuredContent, undefined);
        assert.deepEqual(response.body.result.content, [{ type: 'text', text }]);
      };
      const assertNull = (response: Awaited<ReturnType<typeof send>>, id: string) => {
        assert.deepEqual(output(response), { result: null });
        const dispatched = observedCalls.at(-1)!;
        assert.equal(dispatched.method, 'delete');
        assert.equal(dispatched.path, '/training/student/:id');
        assert.deepEqual(dispatched.options, { params: { id }, innerAccess: false });
        assert.equal(dispatched.result, null, 'real void Action completion is normalized to null');
        return {
          structuredContent: response.body.result.structuredContent,
          content: response.body.result.content,
        };
      };
      assertDenied(await call());
      for (const action of ['select', 'view', 'create', 'update'] as const) {
        off();
        off = allowStudentAction(action);
        assertDenied(await call());
      }
      assert.equal(deletion.mock.callCount(), 0, 'other Student permissions never grant delete');
      assert.deepEqual(await snapshot(target), targetBefore);
      off();
      off = allowStudentAction('delete');
      const beforeList = observedCalls.length;
      const listed = await list();
      assert.equal(listed.status, 200);
      assert.deepEqual(studentToolNames(listed.body.result.tools), [studentDeleteName]);
      assert.deepEqual(studentToolNames((await list(bearer)).body.result.tools), []);
      assert.equal(observedCalls.length, beforeList, 'delete listing performs no trial Action');
      const beforeInvalid = observedCalls.length;
      const readDenied = await call({ id: target.id! }, bearer);
      assert.equal(readDenied.status, 200);
      assert.equal(readDenied.body.error?.code, -32602);
      assert.equal(readDenied.body.result, undefined);
      for (const args of [
        {},
        { id: '' },
        { id: null },
        { id: {} },
        { id: [] },
        { id: true },
        { id: target.id, extra: true },
        { id: target.id, body: {} },
        { id: target.id, path: '/training/student' },
        { id: target.id, route: '/training/student/:id' },
        { id: target.id, method: 'delete' },
        { id: target.id, instanceName: 'shareTest' },
        { id: target.id, tenant: 'shareTest' },
        { id: target.id, innerAccess: true },
        { id: target.id, confirm: true },
      ]) {
        const invalid = await call(args);
        assert.equal(invalid.status, 200);
        assert.equal(invalid.body.error?.code, -32602);
        assert.equal(invalid.body.result, undefined);
      }
      assert.equal(
        observedCalls.length,
        beforeInvalid,
        'read scope and invalid input fail predispatch',
      );
      assert.equal(deletion.mock.callCount(), 0, 'listing and rejected input never enter delete');
      assert.deepEqual(await snapshot(target), targetBefore);
      // Neither a prior listing nor its bearer retains authority after revocation.
      off();
      off = allowStudentAction('view');
      assertDenied(await call());
      assert.equal(deletion.mock.callCount(), 0);
      assert.deepEqual(await snapshot(target), targetBefore);
      off();
      off = allowStudentAction('delete');
      assert.deepEqual(studentToolNames((await list(revokedToken)).body.result.tools), [
        studentDeleteName,
      ]);
      await app.bean.executor.mockCtx(
        async () => app.scope('mcp-auth').service.authorization.revoke(revokedToken),
        { instanceName: '' },
      );
      const beforeRevoked = observedCalls.length;
      assert.equal((await call({ id: target.id! }, revokedToken)).status, 401);
      assert.equal(observedCalls.length, beforeRevoked);
      assert.equal(deletion.mock.callCount(), 0);
      assert.deepEqual(await snapshot(target), targetBefore);

      const completed = assertNull(await call(), target.id!);
      assert.equal(
        deletion.mock.callCount(),
        1,
        'one real aggregate delete, without automatic replay',
      );
      const deleted = await snapshot(target);
      assert.ok(deleted.root, 'ordinary deletion retains the persisted root');
      assert.equal(String(deleted.root.id), target.id);
      assert.equal(deleted.root.deleted, true);
      for (const key of ['content', 'records', 'subjects'] as const) {
        assert.deepEqual(
          deleted[key].map(row => String(row.id)),
          targetBefore[key].map(row => String(row.id)),
          'aggregate descendants are soft-deleted, not physically removed',
        );
        for (const row of deleted[key]) assert.equal(row.deleted, true);
      }
      assert.deepEqual(await snapshot(unrelated), unrelatedBefore);
      assertDenied(
        await send(
          'tools/call',
          { name: studentViewName, arguments: { id: target.id } },
          { headers: { authorization: `Bearer ${allToken}` } },
        ),
      );
      off();
      off = allowStudentAction('view');
      assertDenied(
        await send(
          'tools/call',
          { name: studentViewName, arguments: { id: target.id } },
          { headers: { authorization: `Bearer ${bearer}` } },
        ),
        'Resource not found',
      );
      off();
      off = allowStudentAction('delete');
      // Intentional isolated absence probes, not retries or a replay-safety promise.
      for (const [id, legacy] of [
        [target.id!, true],
        [missing.id!, false],
        [foreign.id!, false],
      ] as const) {
        assert.deepEqual(assertNull(await call({ id }, allToken, legacy), id), completed);
      }
      assert.equal(deletion.mock.callCount(), 4);
      assert.deepEqual(await snapshot(target), deleted);
      assert.deepEqual(await snapshot(missing), missingBefore);
      assert.deepEqual(
        await snapshot(foreign),
        foreignBefore,
        'foreign owning-context rows stay unchanged',
      );
      assert.deepEqual(await snapshot(unrelated), unrelatedBefore);
    } finally {
      off();
      try {
        const failures: unknown[] = [];
        for (const fixture of owned.toReversed()) {
          try {
            await app.bean.executor.mockCtx(
              async () => {
                await collectOwned(fixture);
                for (const id of fixture.subjectIds) {
                  await app
                    .scope('training-recordsubject')
                    .model.subject.deleteById(id, { disableDeleted: true });
                }
                for (const id of fixture.recordIds) {
                  await app
                    .scope('training-record')
                    .model.record.deleteById(id, { disableDeleted: true });
                }
                for (const id of fixture.contentIds) {
                  await app
                    .scope('training-student')
                    .model.studentContent.deleteById(id, { disableDeleted: true });
                }
                if (fixture.id) {
                  await app
                    .scope('training-student')
                    .model.student.deleteById(fixture.id, { disableDeleted: true });
                }
              },
              { instanceName: fixture.instanceName as any },
            );
          } catch (error) {
            failures.push(error);
          }
        }
        assert.deepEqual(failures, [], 'Owned MCP delete cleanup failed');
      } finally {
        for (const spy of spies.toReversed()) spy.mock.restore();
      }
    }
  });

  it('guards student reads and independent select/summary with current roles across modern/legacy read scopes and instance boundaries', async t => {
    if (trainingDisabled) return;
    assert.ok(app.meta.modules['training-student']);
    assert.ok(fixtureUserId);
    const userId = fixtureUserId;
    const name = `MCP student ${randomUUID()}`;
    const mobile = '13812345678';
    const descriptionMarkdown = `# Private student notes\n\n${randomUUID()}`;
    const level = 2;
    const trainingTime = new Date('2026-03-10T08:00:00.000Z');
    const recordName = `MCP record ${randomUUID()}`;
    const subjectName = `MCP subject ${randomUUID()}`;
    const studentData = {
      name,
      mobile,
      level,
      content: { descriptionMarkdown },
      trainingRecords: [
        {
          name: recordName,
          subjectCount: 1,
          totalScore: 88,
          averageScore: 88,
          trainingTime,
          description: 'Owned MCP training record',
          trainingRecordSubjects: [
            { name: subjectName, score: 95, description: 'Owned MCP training subject' },
          ],
        },
      ],
    } as DtoStudentCreate;
    const selectQuery = { name, level, orders: 'createdAt,desc', pageNo: 1, pageSize: 1 };
    const selectEmptyPageQuery = { ...selectQuery, pageNo: 2 };
    const selectColumnsQuery = { ...selectQuery, columns: ['id'] };
    let studentId: string | undefined;
    let imageId: string | undefined;
    let imageDirectory: string | undefined;
    let otherStudentId: string | undefined;
    let adminRoleId: string | undefined;
    let membershipOwned = false;
    const allToken = await redeemBearer('mcp:all');
    const observedCalls: Array<{
      method: unknown;
      path: unknown;
      options: unknown;
      userId: string;
      authId: string;
      roleNames: string[];
      serialized?: Record<string, unknown>;
    }> = [];
    const executor = app.bean.executor;
    const original = executor.performAction;
    const observed = t.mock.method(
      executor,
      'performAction',
      async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
        const call: (typeof observedCalls)[number] = {
          method: args[0],
          path: args[1],
          options: args[2],
          userId: String(this.bean.passport.currentUser?.id),
          authId: String(this.bean.passport.currentAuth?.id),
          roleNames: (this.bean.passport.currentRoles ?? []).map(role => role.name),
        };
        observedCalls.push(call);
        const result = await original.apply(this, args);
        call.serialized = result;
        return result;
      },
    );
    const call = (id: string, token = bearer, legacy = false) =>
      send(
        'tools/call',
        { name: studentSummaryName, arguments: { id } },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const view = (id: string, token = bearer, legacy = false) =>
      send(
        'tools/call',
        { name: studentViewName, arguments: { id } },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const select = (token = bearer, legacy = false, query: Record<string, unknown> = selectQuery) =>
      send(
        'tools/call',
        { name: studentSelectName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const group = (query: Record<string, unknown>, token = bearer, legacy = false) =>
      send(
        'tools/call',
        { name: studentGroupName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const aggregate = (query: Record<string, unknown>, token = bearer, legacy = false) =>
      send(
        'tools/call',
        { name: studentAggregateName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const normalizeSelect = (serialized: Record<string, unknown>) => {
      const normalized = JSON.parse(JSON.stringify(serialized));
      normalized.total = String(normalized.total);
      normalized.list = normalized.list.map((row: Record<string, unknown>) => {
        row.id = String(row.id);
        // The existing optional identity schema normalizes absent SQL values away.
        if (row.imageId === null) delete row.imageId;
        else if (row.imageId !== undefined) row.imageId = String(row.imageId);
        if (row.image) {
          const image = row.image as Record<string, unknown>;
          image.id = String(image.id);
        }
        return row;
      });
      return normalized;
    };
    const assertSelect = (response: Awaited<ReturnType<typeof send>>) => {
      const selected = output(response);
      const current = observedCalls.at(-1)!;
      assert.equal(current.path, '/training/student');
      assert.deepEqual(current.options, { query: selectQuery, innerAccess: false });
      assert.ok(current.serialized);
      assert.deepEqual(
        selected,
        normalizeSelect(current.serialized),
        'MCP preserves the complete serialized Action result with existing DTO normalization',
      );
      assert.equal(selected.total, '1');
      assert.equal(selected.pageNo, 1);
      assert.equal(selected.pageSize, 1);
      assert.equal(selected.pageCount, 1);
      assert.equal(selected.list.length, 1);
      const student = selected.list[0];
      assert.equal(String(student.id), studentId);
      assert.notEqual(String(student.id), otherStudentId);
      assert.equal(student.name, name);
      assert.equal(student.level, level);
      assert.equal(student.mobile, '138****5678', 'select retains serialized masked mobile');
      assert.equal(student.imageId, imageId);
      assert.equal(student.image.id, imageId);
      assert.equal(student.image.public, true);
      assert.equal(student.image.signed, false);
      const imageUrl = new URL(student.image.url);
      assert.equal(imageUrl.origin, origin);
      assert.match(imageUrl.pathname, /^\/api\/static\/public\/\d+\/image-native\//);
      assert.equal(imageUrl.search, '');
      for (const field of ['content', 'contentHtml', 'trainingRecords']) {
        assert.equal(Object.hasOwn(student, field), false, 'select does not load new relations');
      }
      const wire = JSON.stringify(response.body.result);
      for (const secret of [mobile, descriptionMarkdown]) {
        assert.equal(wire.includes(secret), false);
      }
      for (const field of ['descriptionMarkdown', 'descriptionHtml']) {
        assert.equal(wire.includes(`"${field}"`), false);
      }
      return selected;
    };
    const normalizeView = (serialized: Record<string, unknown>) => {
      const normalized = JSON.parse(JSON.stringify(serialized));
      normalized.id = String(normalized.id);
      // Preserve the select regression's measured optional-identity normalization.
      if (normalized.imageId === null) delete normalized.imageId;
      else if (normalized.imageId !== undefined) normalized.imageId = String(normalized.imageId);
      if (normalized.image) normalized.image.id = String(normalized.image.id);
      // DtoStudentView includes content.columns: ['descriptionMarkdown'], not its SQL id.
      if (normalized.content) delete normalized.content.id;
      for (const record of normalized.trainingRecords ?? []) {
        record.id = String(record.id);
        // Both nested DTOs retain EntityBaseInner's declared deleted default.
        if (record.deleted === undefined) record.deleted = false;
        // These two optional identity arrays normalize absent SQL nulls away.
        if (record.sceneImageIds === null) delete record.sceneImageIds;
        if (record.dossierFileIds === null) delete record.dossierFileIds;
        for (const subject of record.trainingRecordSubjects ?? []) {
          subject.id = String(subject.id);
          if (subject.deleted === undefined) subject.deleted = false;
        }
      }
      return normalized;
    };
    const assertView = (response: Awaited<ReturnType<typeof send>>) => {
      const student = output(response);
      const current = observedCalls.at(-1)!;
      assert.equal(current.path, '/training/student/:id');
      assert.deepEqual(current.options, { params: { id: studentId }, innerAccess: false });
      assert.ok(current.serialized);
      assert.deepEqual(
        student,
        normalizeView(current.serialized),
        'both MCP channels preserve the complete serialized view Action with existing DTO normalization',
      );
      assert.equal(student.id, studentId);
      assert.notEqual(student.id, otherStudentId);
      assert.equal(student.name, name);
      assert.equal(student.level, level);
      assert.equal(student.mobile, '138****5678', 'view retains serialized masked mobile');
      assert.equal(student.imageId, imageId);
      assert.equal(student.image.id, imageId);
      assert.equal(student.image.public, true);
      assert.equal(student.image.signed, false);
      const imageUrl = new URL(student.image.url);
      assert.equal(imageUrl.origin, origin);
      assert.match(imageUrl.pathname, /^\/api\/static\/public\/\d+\/image-native\//);
      assert.equal(imageUrl.search, '');
      assert.equal(student.content.descriptionMarkdown, descriptionMarkdown);
      assert.equal(student.trainingRecords.length, 1);
      const record = student.trainingRecords[0];
      assert.equal(typeof record.id, 'string');
      assert.ok(record.id);
      assert.equal(record.name, recordName);
      assert.equal(record.subjectCount, 1);
      assert.equal(record.totalScore, 88);
      assert.equal(record.averageScore, 88);
      // Vona's JSON.parse reviver turns the HTTP ISO string back into a Date.
      assert.ok(record.trainingTime instanceof Date);
      assert.equal(record.trainingTime.toISOString(), trainingTime.toISOString());
      assert.equal(record.description, 'Owned MCP training record');
      assert.equal(record.trainingRecordSubjects.length, 1);
      const subject = record.trainingRecordSubjects[0];
      assert.equal(typeof subject.id, 'string');
      assert.ok(subject.id);
      assert.equal(subject.name, subjectName);
      assert.equal(subject.score, 95);
      assert.equal(subject.description, 'Owned MCP training subject');
      assert.equal(JSON.stringify(response.body.result).includes(mobile), false);
    };
    const errorResult = (response: Awaited<ReturnType<typeof send>>, text: string) => {
      assert.equal(response.status, 200);
      assert.equal(response.body.error, undefined);
      assert.equal(response.body.result.isError, true);
      assert.equal(response.body.result.structuredContent, undefined);
      assert.deepEqual(response.body.result.content, [{ type: 'text', text }]);
      return response.body.result;
    };
    try {
      imageDirectory = await fse.mkdtemp(path.join(os.tmpdir(), 'mcp-student-image-'));
      const imageFile = path.join(imageDirectory, 'student.png');
      await fse.writeFile(
        imageFile,
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
          'base64',
        ),
      );
      await app.bean.executor.mockCtx(
        async () => {
          const image = await app.bean.image.upload(
            'image-native:native',
            { file: imageFile, filename: 'student.png', contentType: 'image/png' },
            { imageScene: 'training-student:studentImage', clientOptions: { public: true } },
          );
          imageId = String(image.id);
          const training = app.scope('training-student');
          const student = await training.service.student.create({ ...studentData, imageId });
          studentId = String(student.id);
          const role = await app.scope('home-user').model.role.getByName('systemAdmin');
          assert.ok(role, 'existing shared systemAdmin role is read-only');
          adminRoleId = String(role.id);
          assert.equal(
            await app.scope('home-user').model.roleUser.get({ userId, roleId: role.id }),
            undefined,
            'the OAuth fixture starts without the unrestricted role',
          );
        },
        { instanceName: '' },
      );
      await app.bean.executor.mockCtx(
        async () => {
          const student = await app.scope('training-student').service.student.create({
            name,
            mobile,
            level,
            content: { descriptionMarkdown },
          } as DtoStudentCreate);
          otherStudentId = String(student.id);
        },
        { instanceName: 'shareTest' as any },
      );
      assert.ok(studentId);
      assert.ok(otherStudentId);
      assert.ok(adminRoleId);
      // Neither OAuth scope grants ordinary users student-select or student-view authority.
      for (const { token, legacy } of [bearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        errorResult(await select(token, legacy), 'Action failed');
        errorResult(await group({ name }, token, legacy), 'Action failed');
        errorResult(await aggregate({ name }, token, legacy), 'Action failed');
        errorResult(await view(studentId, token, legacy), 'Action failed');
        errorResult(await call(studentId, token, legacy), 'Action failed');
        assert.equal(observedCalls.at(-1)!.roleNames.includes('systemAdmin'), false);
      }
      // A test-only policy separates select from view without adding any role membership.
      const { ServiceStudent } = await import('vona-module-training-student');
      const studentSelect = t.mock.method(ServiceStudent.prototype, 'select');
      const studentView = t.mock.method(ServiceStudent.prototype, 'view');
      const summary = t.mock.method(ServiceStudent.prototype, 'summary');
      const studentGroup = t.mock.method(ServiceStudent.prototype, 'group');
      const studentAggregate = t.mock.method(ServiceStudent.prototype, 'aggregate');
      const policyCalls: Array<{ action: string; policyActionKey: string }> = [];
      const controllerBeanFullName = 'training-student.controller.student';
      let viewOnly = false;
      const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
        if (
          String(app.bean.passport.currentUser?.id) !== userId ||
          app.ctx.instanceName !== '' ||
          request.action.controllerBeanFullName !== controllerBeanFullName
        ) {
          return next();
        }
        assert.equal(String(app.bean.passport.currentAuth?.id), fixtureAuthId);
        assert.equal(
          app.bean.passport.currentRoles?.some(role => role.name === 'systemAdmin'),
          false,
        );
        policyCalls.push({
          action: request.action.action,
          policyActionKey: request.policyActionKey,
        });
        return {
          allowed:
            request.policyActionKey === `${controllerBeanFullName}#${viewOnly ? 'view' : 'select'}`,
          actionKey: request.action.actionKey,
          action: request.action,
        };
      });
      try {
        for (const { token, legacy } of [bearer, allToken].flatMap(token =>
          [false, true].map(legacy => ({ token, legacy })),
        )) {
          const selected = assertSelect(await select(token, legacy));
          assert.deepEqual(output(await group({ name }, token, legacy)), {
            result: [{ level, count_all: '1' }],
          });
          assert.deepEqual(output(await aggregate({ name }, token, legacy)), {
            count_all: '1',
            count_imageId: '1',
          });
          const deniedView = await view(selected.list[0].id, token, legacy);
          errorResult(deniedView, 'Action failed');
          const deniedResponse = await call(selected.list[0].id, token, legacy);
          errorResult(deniedResponse, 'Action failed');
          assert.equal(studentView.mock.callCount(), 0, 'select alone cannot enter view service');
          assert.equal(summary.mock.callCount(), 0, 'view denial prevents summary service work');
          for (const response of [deniedView, deniedResponse]) {
            const wire = JSON.stringify(response.body.result);
            for (const secret of [mobile, '138****5678', descriptionMarkdown]) {
              assert.equal(wire.includes(secret), false);
            }
            for (const field of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
              assert.equal(wire.includes(`"${field}"`), false);
            }
          }
        }
        assert.deepEqual(
          policyCalls,
          Array.from({ length: 4 })
            .fill([
              { action: 'select', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'group', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'aggregate', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'view', policyActionKey: `${controllerBeanFullName}#view` },
              { action: 'summary', policyActionKey: `${controllerBeanFullName}#view` },
            ])
            .flat(),
          'the real guard resolves distinct inherited permissions on every transport/scope pair',
        );
        viewOnly = true;
        for (const { token, legacy } of [bearer, allToken].flatMap(token =>
          [false, true].map(legacy => ({ token, legacy })),
        )) {
          errorResult(await select(token, legacy), 'Action failed');
          errorResult(await group({ name }, token, legacy), 'Action failed');
          errorResult(await aggregate({ name }, token, legacy), 'Action failed');
          assertView(await view(studentId, token, legacy));
          const independent = output(await call(studentId, token, legacy));
          assert.equal(
            independent.id,
            studentId,
            'summary accepts an authorized ID without a successful select',
          );
          assert.deepEqual(Object.keys(independent).sort(), studentSummaryFields);
        }
        assert.equal(studentSelect.mock.callCount(), 4, 'view alone cannot enter select service');
        assert.equal(studentView.mock.callCount(), 4);
        assert.equal(summary.mock.callCount(), 4);
        assert.equal(studentGroup.mock.callCount(), 4, 'view alone cannot enter group service');
        assert.equal(
          studentAggregate.mock.callCount(),
          4,
          'view alone cannot enter aggregate service',
        );
        assert.deepEqual(
          policyCalls.slice(20),
          Array.from({ length: 4 })
            .fill([
              { action: 'select', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'group', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'aggregate', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'view', policyActionKey: `${controllerBeanFullName}#view` },
              { action: 'summary', policyActionKey: `${controllerBeanFullName}#view` },
            ])
            .flat(),
          'view alone cannot admit select, group or aggregate',
        );
      } finally {
        off();
        studentSelect.mock.restore();
        studentView.mock.restore();
        summary.mock.restore();
        studentGroup.mock.restore();
        studentAggregate.mock.restore();
      }
      errorResult(await select(), 'Action failed');
      errorResult(await group({ name }), 'Action failed');
      errorResult(await aggregate({ name }), 'Action failed');
      errorResult(await view(studentId), 'Action failed');
      errorResult(await call(studentId), 'Action failed');
      assert.equal(policyCalls.length, 40, 'the exact test policy listener was removed');
      // Basic has no custom grant provider. Exercise its supported unrestricted role
      // through the ordinary membership API, without mutating the shared role itself.
      await app.bean.executor.mockCtx(
        async () => {
          membershipOwned = await app.bean.role.addUserId(adminRoleId!, userId);
          assert.equal(membershipOwned, true);
        },
        { instanceName: '' },
      );
      const expected = {
        id: studentId,
        name,
        level,
        levelTitle: String(level),
        descriptionLength: descriptionMarkdown.length,
        summaryText: `${name} is in level ${level}. Description length: ${descriptionMarkdown.length}.`,
      };
      for (const { token, legacy } of [bearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        const selected = assertSelect(await select(token, legacy));
        assertView(await view(selected.list[0].id, token, legacy));
        assert.ok(
          observedCalls.at(-1)!.roleNames.includes('systemAdmin'),
          'view reloads current roles for existing tokens',
        );
        const callsBeforeInvalid = observedCalls.length;
        for (const args of [
          {},
          { id: studentId, extra: true },
          { id: {} },
          { id: studentId, path: '/training/student' },
        ]) {
          const invalid = await send(
            'tools/call',
            { name: studentViewName, arguments: args },
            { legacy, headers: { authorization: `Bearer ${token}` } },
          );
          assert.equal(invalid.status, 200);
          assert.equal(invalid.body.error?.code, -32602);
          assert.equal(invalid.body.result, undefined);
        }
        assert.equal(
          observedCalls.length,
          callsBeforeInvalid,
          'strict view arguments fail before Action dispatch',
        );
        const response = await call(selected.list[0].id, token, legacy);
        const summary = output(response);
        assert.deepEqual(summary, expected);
        assert.deepEqual(Object.keys(summary).sort(), studentSummaryFields);
        const current = observedCalls.at(-1)!;
        assert.ok(
          current.roleNames.includes('systemAdmin'),
          'existing tokens reload current roles',
        );
        assert.equal(current.serialized?.mobile, '138****5678', 'controller serializer ran');
        assert.equal(current.serialized?.descriptionMarkdown, descriptionMarkdown);
        assert.deepEqual(
          {
            ...Object.fromEntries(
              studentSummaryFields.map(field => [field, current.serialized?.[field]]),
            ),
            id: String(current.serialized?.id),
          },
          expected,
          'MCP projects the serialized guarded action result',
        );
        const wire = JSON.stringify(response.body.result);
        for (const secret of [mobile, '138****5678', descriptionMarkdown]) {
          assert.equal(wire.includes(secret), false);
        }
        for (const field of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
          assert.equal(wire.includes(`"${field}"`), false);
        }
      }
      const groupQuery = { name, level, groups: ['level'], aggrs: { count: ['*', 'imageId'] } };
      assert.deepEqual(output(await group(groupQuery)), {
        result: [{ level, count_all: '1', count_imageId: '1' }],
      });
      const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
      const analysisDefaults = {
        orders: ormQuery?.orders?.default ?? 'createdAt,desc',
        pageNo: 1,
        pageSize: ormQuery?.pageSize?.default ?? 20,
      };
      assert.deepEqual(observedCalls.at(-1)!.options, {
        query: { ...analysisDefaults, ...groupQuery },
        innerAccess: false,
      });
      const aggregateQuery = { name, level, aggrs: { count: ['imageId'] } };
      assert.deepEqual(output(await aggregate(aggregateQuery)), { count_imageId: '1' });
      assert.deepEqual(observedCalls.at(-1)!.options, {
        query: { ...analysisDefaults, ...aggregateQuery },
        innerAccess: false,
      });
      for (const id of ['-1', otherStudentId]) {
        assert.deepEqual(output(await group({ where: { id } })), { result: [] });
        assert.deepEqual(output(await aggregate({ where: { id } })), {
          count_all: '0',
          count_imageId: '0',
        });
      }
      const emptyPage = output(await select(bearer, false, selectEmptyPageQuery));
      assert.deepEqual(
        emptyPage,
        normalizeSelect(observedCalls.at(-1)!.serialized!),
        'empty-page output also preserves the serialized Action envelope',
      );
      assert.deepEqual(emptyPage, {
        list: [],
        total: '1',
        pageNo: 2,
        pageSize: 1,
        pageCount: 1,
      });
      errorResult(await select(bearer, false, selectColumnsQuery), 'Action failed');
      const missing = errorResult(await call('-1'), 'Resource not found');
      const otherInstance = errorResult(await call(otherStudentId), 'Resource not found');
      assert.deepEqual(otherInstance, missing);
      const missingView = errorResult(await view('-1'), 'Resource not found');
      const otherInstanceView = errorResult(await view(otherStudentId), 'Resource not found');
      assert.deepEqual(otherInstanceView, missingView);
      assert.deepEqual(missingView, missing, 'view and summary expose the same safe absence');
      for (const current of observedCalls) {
        assert.equal(current.method, 'get');
        if (
          current.path === '/training/student/:id' ||
          current.path === '/training/student/summary/:id'
        ) {
          const options = current.options as { params: { id: string }; innerAccess: boolean };
          assert.deepEqual(options, { params: { id: options.params.id }, innerAccess: false });
        } else if (current.path === '/training/student') {
          assert.ok(
            [selectQuery, selectEmptyPageQuery, selectColumnsQuery].some(query =>
              isDeepStrictEqual(current.options, { query, innerAccess: false }),
            ),
            'select retains only the explicitly supplied filter/pagination/columns query',
          );
        } else {
          assert.ok(
            ['/training/student/group', '/training/student/aggregate'].includes(
              String(current.path),
            ),
          );
          assert.equal((current.options as { innerAccess: boolean }).innerAccess, false);
        }
        assert.equal(current.userId, userId);
        assert.equal(current.authId, fixtureAuthId);
      }
      assert.deepEqual(
        Object.fromEntries(
          [
            '/training/student',
            '/training/student/group',
            '/training/student/aggregate',
            '/training/student/:id',
            '/training/student/summary/:id',
          ].map(path => [path, observedCalls.filter(current => current.path === path).length]),
        ),
        {
          '/training/student': 19,
          '/training/student/group': 16,
          '/training/student/aggregate': 16,
          '/training/student/:id': 19,
          '/training/student/summary/:id': 19,
        },
        'every student read traverses its fixed guarded action',
      );
      assert.equal(observedCalls.length, 89);
      await app.bean.executor.mockCtx(
        async () => {
          assert.equal(await app.bean.role.removeUserId(adminRoleId!, userId), true);
          membershipOwned = false;
        },
        { instanceName: '' },
      );
      for (const { token, legacy } of [bearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        errorResult(await select(token, legacy), 'Action failed');
        errorResult(await group({ name }, token, legacy), 'Action failed');
        errorResult(await aggregate({ name }, token, legacy), 'Action failed');
        errorResult(await view(studentId, token, legacy), 'Action failed');
        errorResult(await call(studentId, token, legacy), 'Action failed');
        assert.equal(observedCalls.at(-1)!.roleNames.includes('systemAdmin'), false);
      }
      assert.equal(
        observedCalls.length,
        109,
        'revocation rechecks all five reads on every scope/transport pair',
      );
    } finally {
      try {
        try {
          await app.bean.executor.mockCtx(
            async () => {
              if (membershipOwned && adminRoleId) {
                await app.bean.role.removeUserId(adminRoleId, userId);
                membershipOwned = false;
              }
              if (studentId) {
                await app.scope('training-student').service.student.deleteForce(studentId);
              }
              if (imageId) await app.bean.image.delete(imageId);
            },
            { instanceName: '' },
          );
        } finally {
          if (otherStudentId) {
            await app.bean.executor.mockCtx(
              async () => {
                await app.scope('training-student').service.student.deleteForce(otherStudentId!);
              },
              { instanceName: 'shareTest' as any },
            );
          }
        }
      } finally {
        try {
          if (imageDirectory) await fse.remove(imageDirectory);
        } finally {
          observed.mock.restore();
        }
      }
    }
  });

  it('enforces the direct DCR HTTP boundary and rejects malformed registration requests', async () => {
    const validBody = JSON.stringify({
      client_name: 'HTTP negative-case client',
      redirect_uris: [`${origin}/negative-callback`],
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code'],
      response_types: ['code'],
    });
    const assertError = async (
      options: Parameters<typeof openHttp>[0],
      status: number,
      code: string,
    ) => {
      const response = await openHttp(options).response;
      assert.equal(response.status, status);
      assert.equal(response.body.error, code);
      assert.equal(response.headers['cache-control'], 'no-store');
    };

    await assertError({ method: 'GET', target: '/mcp/register' }, 405, 'invalid_request');
    await assertError(
      { target: '/mcp/register?unexpected=1', body: validBody },
      400,
      'invalid_request',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: validBody,
        headers: { authorization: 'Bearer forbidden' },
      },
      403,
      'invalid_request',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: validBody,
        headers: { 'content-type': 'text/plain' },
      },
      415,
      'invalid_client_metadata',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: validBody,
        headers: { 'content-encoding': 'gzip' },
      },
      415,
      'invalid_client_metadata',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: 'x'.repeat(16385),
      },
      413,
      'invalid_client_metadata',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: '{"client_name":"duplicate","client_name":"duplicate","redirect_uris":["https://client.example.test/callback"]}',
      },
      400,
      'invalid_client_metadata',
    );
    for (const application_type of ['web', null]) {
      await assertError(
        {
          target: '/mcp/register',
          body: JSON.stringify({ ...JSON.parse(validBody), application_type }),
        },
        400,
        'invalid_client_metadata',
      );
    }
    await assertError(
      {
        target: '/mcp/register',
        body: JSON.stringify({ ...JSON.parse(validBody), application_type: 'native', resource }),
      },
      400,
      'invalid_client_metadata',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: JSON.stringify({
          ...JSON.parse(validBody),
          redirect_uris: [`${origin}/negative-callback#fragment`],
        }),
      },
      400,
      'invalid_redirect_uri',
    );
    await assertError(
      {
        target: '/mcp/register',
        body: validBody,
        headers: { forwarded: 'for=192.0.2.1' },
      },
      400,
      'invalid_request',
    );
    await assertError(
      {
        target: '/mcp/register?instanceName=shareTest',
        body: validBody,
      },
      400,
      'invalid_request',
    );

    const metadata = await openHttp({
      target: '/.well-known/oauth-authorization-server/mcp',
      method: 'GET',
    }).response;
    assert.equal(metadata.status, 200);
    assert.equal(metadata.body.issuer, resource);
    assert.equal(metadata.body.authorization_endpoint, `${resource}/auth`);
    assert.equal(metadata.body.token_endpoint, `${resource}/token`);
    assert.equal(metadata.body.registration_endpoint, `${resource}/register`);
    assert.deepEqual(metadata.body.grant_types_supported, ['authorization_code', 'refresh_token']);
    assert.deepEqual(metadata.body.scopes_supported, ['mcp:all', 'mcp:read']);
    assert.equal(metadata.headers['cache-control'], 'no-store');

    const refresh = await openHttp({
      target: '/mcp/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: 'not-issued',
        resource,
      }).toString(),
    }).response;
    assert.equal(refresh.status, 400);
    assert.equal(refresh.body.error, 'unauthorized_client');
    assert.equal(refresh.headers['cache-control'], 'no-store');
    const unsupportedGrant = await openHttp({
      target: '/mcp/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        resource,
      }).toString(),
    }).response;
    assert.equal(unsupportedGrant.status, 400);
    assert.equal(unsupportedGrant.body.error, 'unsupported_grant_type');
  });

  it('refreshes an explicitly opted-in OAuth grant over HTTP and retains read access after wrong-client refresh attempts', async t => {
    if (trainingDisabled) return;
    const evidence: Array<{ event: string; family: string; generation: number }> = [];
    const logger = t.mock.getter(ServiceAuthorization.prototype as any, '$logger', () => ({
      debug(event: string, message: (typeof evidence)[number]) {
        assert.equal(event, message.event);
        evidence.push(message);
      },
    }));
    const clients: string[] = [];
    const off = allowStudentAction('select');
    try {
      for (const label of ['owner', 'wrong-client']) {
        // Own these client fixtures without consuming the DCR boundary test's IP quota.
        const registration = await app.bean.executor.mockCtx(
          async () =>
            app.scope('mcp-auth').service.registration.register(
              {
                client_name: `Managed MCP refresh ${label}`,
                redirect_uris: [redirectUri],
                token_endpoint_auth_method: 'none',
                grant_types: ['authorization_code', 'refresh_token'],
                response_types: ['code'],
                scope: 'mcp:read',
              },
              { resource, instanceName: '' },
            ),
          { instanceName: '' },
        );
        clients.push(registration.client_id);
        assert.deepEqual(registration.grant_types, ['authorization_code', 'refresh_token']);
      }
      const [owner, wrongClient] = clients;
      const token = await redeemTokens('mcp:read', owner);
      assert.ok(token.refresh_token);
      assert.match(token.refresh_token, /^[\w-]+\.[\w-]+\.[\w-]+$/);
      const refresh = (oauthClientId: string, refreshToken: string) =>
        openHttp({
          target: '/mcp/token',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: oauthClientId,
            refresh_token: refreshToken,
            resource,
          }).toString(),
        }).response;
      const read = (accessToken: string) =>
        send(
          'tools/call',
          { name: studentSelectName, arguments: { name: `MCP refresh absent ${randomUUID()}` } },
          { headers: { authorization: `Bearer ${accessToken}` } },
        );
      const wrong = await refresh(wrongClient, token.refresh_token);
      assert.equal(wrong.status, 400);
      assert.equal(wrong.body.error, 'invalid_grant');
      assert.equal(wrong.headers['cache-control'], 'no-store');
      assert.deepEqual(output(await read(token.access_token)).list, []);
      assert.equal(evidence.length, 0, 'Initial access and wrong-client refresh emit no evidence');

      // Refresh is a direct token request: no second authorization or consent decision.
      const refreshed = await refresh(owner, token.refresh_token);
      assert.equal(refreshed.status, 200);
      assert.equal(refreshed.headers['cache-control'], 'no-store');
      assert.equal(refreshed.body.token_type, 'Bearer');
      assert.equal(refreshed.body.scope, 'mcp:read');
      assert.equal(refreshed.body.expires_in, 7200);
      assert.match(refreshed.body.access_token, /^[\w-]+\.[\w-]+\.[\w-]+$/);
      assert.match(refreshed.body.refresh_token, /^[\w-]+\.[\w-]+\.[\w-]+$/);
      assert.equal(refreshed.body.access_token === token.access_token, false);
      assert.equal(refreshed.body.refresh_token === token.refresh_token, false);
      assert.equal(evidence.length, 1);
      const family = evidence[0].family;
      assert.match(family, /^[a-f0-9]{64}$/);
      assert.deepEqual(evidence, [{ event: 'mcp.oauth.refresh_succeeded', family, generation: 2 }]);
      const old = await read(token.access_token);
      assert.equal(old.status, 401);
      assert.match(String(old.headers['www-authenticate']), /error="invalid_token"/);
      assert.equal(evidence.length, 1, 'Rejected old access emits no acceptance');
      assert.deepEqual(output(await read(refreshed.body.access_token)).list, []);
      assert.deepEqual(evidence, [
        { event: 'mcp.oauth.refresh_succeeded', family, generation: 2 },
        { event: 'mcp.oauth.refreshed_access_accepted', family, generation: 2 },
      ]);

      // A foreign client presenting a consumed generation must not revoke its owner's family.
      const wrongReplay = await refresh(wrongClient, token.refresh_token);
      assert.equal(wrongReplay.status, 400);
      assert.equal(wrongReplay.body.error, 'invalid_grant');
      assert.equal(evidence.length, 2);
      assert.deepEqual(output(await read(refreshed.body.access_token)).list, []);
      assert.deepEqual(evidence[2], {
        event: 'mcp.oauth.refreshed_access_accepted',
        family,
        generation: 2,
      });
      const serialized = JSON.stringify(evidence);
      for (const secret of [
        ...clients,
        token.access_token,
        token.refresh_token,
        refreshed.body.access_token,
        refreshed.body.refresh_token,
        redirectUri,
      ]) {
        assert.equal(serialized.includes(secret), false);
      }
    } finally {
      logger.mock.restore();
      off();
      await app.bean.executor.mockCtx(
        async () => {
          for (const id of clients.toReversed()) {
            await app.scope('mcp-auth').model.authorization.delete({ oauthClientId: id });
            await app.scope('mcp-auth').model.client.delete({ oauthClientId: id });
          }
        },
        { instanceName: '' },
      );
    }
  });

  it('uses only the automatically resolved canonical instance and rejects conflicting selectors before dispatch', async () => {
    const contexts = mcpTransportSnapshot(app)?.contexts ?? 0;
    const queryField = app.config.instance.queryField!;
    const headerField = app.config.instance.headerField!;
    for (const options of [
      { target: '/mcp?instanceName=shareTest' },
      { target: `/mcp?${encodeURIComponent(queryField)}=shareTest` },
      { headers: { [headerField]: 'shareTest' } },
      { target: '/mcp?instanceName=', headers: { [headerField]: 'shareTest' } },
      { target: '/mcp?instanceName=unconfigured' },
    ])
      assert.equal((await send('tools/list', {}, options)).status, 403);
    assert.equal(mcpTransportSnapshot(app)?.contexts ?? 0, contexts);
    for (const target of ['/mcp', '/mcp?instanceName=']) {
      const listed = await send('tools/list', {}, { target });
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      assert.deepEqual(studentToolNames(listed.body.result.tools), []);
    }
  });

  it('requires canonical backend authority and bearer while retaining protocol guards and cancellation ownership', async () => {
    assert.equal(
      (await send('tools/list', {}, { headers: { origin: 'https://client.example.test' } })).status,
      200,
    );
    for (const [options, status] of [
      [{ headers: { host: `unregistered.example.test:${port}` } }, 400],
      [{ headers: { forwarded: 'for=192.0.2.1' } }, 403],
      [{ headers: { cookie: 'token=forbidden' } }, 403],
      [{ headers: { 'proxy-authorization': 'Bearer forbidden' } }, 403],
      [{ headers: { authorization: 'synthetic-forbidden' } }, 401],
      [{ headers: { authorization: ['Bearer first', 'Bearer second'] } }, 401],
      [{ target: '/mcp?instanceName=shareTest&instanceName=' }, 400],
      [{ target: '/mcp?access_token=forbidden' }, 400],
      [{ target: '/mcp?unexpected=1' }, 400],
    ] as [{ headers?: OutgoingHttpHeaders; target?: string }, number][]) {
      assert.equal((await send('tools/list', {}, options)).status, status);
    }
    const instanceHeader = app.config.instance.headerField;
    assert.ok(instanceHeader);
    assert.equal(
      (await send('tools/list', {}, { headers: { [instanceHeader]: ['shareTest', 'shareTest'] } }))
        .status,
      400,
    );
    assert.equal(
      (
        await send(
          'tools/list',
          {},
          {
            headers: { 'x-large': 'x'.repeat(fixtureIngressLimits.headerValueBytes + 1) },
          },
        )
      ).status,
      431,
    );
    const pending = openHttp({
      body: '{',
      partial: true,
      headers: { 'content-length': '100', 'authorization': `Bearer ${bearer}` },
    });
    try {
      await waitFor(() => mcpTransportSnapshot(app)?.active === 1);
      assert.equal((await send('tools/list')).status, 429);
    } finally {
      pending.req.destroy();
      await waitFor(() => !mcpTransportSnapshot(app)?.active);
    }
    assert.equal((await send('tools/list')).status, 200);
    assert.ok(app.server?.listening);
  });

  it('retains signed and opaque MCP provenance in guarded Actions and rejects ordinary credential conversion', async t => {
    if (trainingDisabled) return;
    const evidence: unknown[] = [];
    const logger = t.mock.getter(ServiceAuthorization.prototype as any, '$logger', () => ({
      debug: (_event: string, message: unknown) => evidence.push(message),
    }));
    const { ServiceStudent } = await import('vona-module-training-student');
    const original = ServiceStudent.prototype.select;
    const off = allowStudentAction('select');
    const opaque = randomBytes(32).toString('base64url');
    const opaqueDigest = createHash('sha256').update(opaque).digest('hex');
    let legacyRequestDigest: string | undefined;
    let ordinaryCode: string;
    const observed = t.mock.method(
      ServiceStudent.prototype,
      'select',
      async function (
        this: InstanceType<typeof ServiceStudent>,
        ...args: Parameters<InstanceType<typeof ServiceStudent>['select']>
      ) {
        const passport = this.bean.passport;
        const current = passport.current;
        const payload = this.ctx.state.passportPayloadData;
        assert.ok(current);
        assert.ok(payload);
        assert.equal(this.ctx.state.passportAuthTokenClient, 'mcpAccess');
        assert.equal(String(passport.currentUser?.id), fixtureUserId);
        assert.equal(String(passport.currentAuth?.id), fixtureAuthId);
        assert.ok(passport.isAuthenticated);
        assert.equal(this.ctx.innerAccess, false);
        assert.equal(this.ctx.req.headers.authorization, undefined);
        assert.equal(this.ctx.req.headers.cookie, undefined);
        assert.equal(this.ctx.req.headers['proxy-authorization'], undefined);
        // A broken admission/issuance guard must fail without signing ordinary credentials.
        const issue = t.mock.method(this.bean.jwt, 'create', async () =>
          assert.fail('MCP Action must not issue ordinary access/refresh credentials'),
        );
        const temp = t.mock.method(this.bean.jwt, 'createTempAuthToken', async () =>
          assert.fail('MCP Action must not issue ordinary temporary credentials'),
        );
        try {
          for (const convert of [
            () => passport.signin(current),
            () => passport.createTempAuthToken(),
            () => passport.createAuthTokenFromOauthCode(ordinaryCode),
          ]) {
            await assert.rejects(convert, error => error instanceof Error && error.code === 403);
            assert.equal(passport.current, current);
            assert.equal(this.ctx.state.passportPayloadData, payload);
            assert.equal(this.ctx.state.passportAuthTokenClient, 'mcpAccess');
          }
          assert.equal(issue.mock.callCount(), 0);
          assert.equal(temp.mock.callCount(), 0);
        } finally {
          issue.mock.restore();
          temp.mock.restore();
        }
        return await original.apply(this, args);
      },
    );
    try {
      const legacySigned = await redeemBearer();
      ordinaryCode = await app.bean.executor.mockCtx(
        async () => {
          const grant = await app.scope('mcp-auth').model.authorization.get({
            tokenDigest: await issuedTokenDigest(legacySigned),
          });
          assert.ok(grant);
          legacyRequestDigest = grant.requestDigest;
          // Model a previously issued opaque grant, retaining its real consent/client binding.
          const count = await app
            .scope('mcp-auth')
            .model.authorization.builderSelect()
            .where({ id: grant.id })
            .update({ tokenDigest: opaqueDigest, tokenVersion: 0, refreshGeneration: 0 });
          assert.equal(count, 1);
          const checked = await app.bean.passport.checkAuthToken(browserToken);
          assert.ok(checked);
          const code = await app.bean.jwt.createOauthCode(checked.payloadData);
          assert.deepEqual(await app.bean.jwt.get('code').verify(code), checked.payloadData);
          return code;
        },
        { instanceName: '' },
      );
      for (const token of [bearer, opaque]) {
        assert.deepEqual(
          output(
            await send(
              'tools/call',
              { name: studentSelectName, arguments: { name: randomUUID() } },
              { headers: { authorization: `Bearer ${token}` } },
            ),
          ).list,
          [],
        );
      }
      assert.equal(observed.mock.callCount(), 2);
      assert.deepEqual(evidence, [], 'Signed initial and opaque access are not refreshed access');
    } finally {
      logger.mock.restore();
      off();
      observed.mock.restore();
      await app.bean.executor.mockCtx(
        async () => {
          if (legacyRequestDigest) {
            await app.scope('mcp-auth').model.authorization.delete({
              requestDigest: legacyRequestDigest,
            });
          }
        },
        { instanceName: '' },
      );
    }
  });

  it('publishes direct resource metadata and rejects missing, JWT, revoked and expired tokens without business dispatch', async t => {
    const metadata = await openHttp({
      method: 'GET',
      target: '/.well-known/oauth-protected-resource/mcp',
    }).response;
    assert.equal(metadata.status, 200);
    assert.deepEqual(metadata.body, {
      resource,
      authorization_servers: [resource],
      scopes_supported: ['mcp:all', 'mcp:read'],
      bearer_methods_supported: ['header'],
    });
    assert.equal(metadata.headers['cache-control'], 'no-store');
    const missing = await openHttp({
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    }).response;
    assert.equal(missing.status, 401);
    assert.equal(
      missing.headers['www-authenticate'],
      `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp"`,
    );
    const held = t.mock.method(app.bean.executor, 'performAction', async () => {
      throw new Error('unauthorized business dispatch');
    });
    try {
      for (const token of ['a'.repeat(43), browserToken]) {
        const denied = await send(
          'tools/call',
          { name: studentSelectName, arguments: { name: 'Student' } },
          { headers: { authorization: `Bearer ${token}` } },
        );
        assert.equal(denied.status, 401);
        assert.match(String(denied.headers['www-authenticate']), /error="invalid_token"/);
      }
      for (const mode of ['revoked', 'expired'] as const) {
        const token = await redeemBearer();
        await app.bean.executor.mockCtx(
          async () => {
            if (mode === 'revoked') {
              await app.scope('mcp-auth').service.authorization.revoke(token);
            } else {
              await app
                .scope('mcp-auth')
                .model.authorization.builderSelect()
                .where({ tokenDigest: await issuedTokenDigest(token) })
                .update({ tokenExpiresAt: Date.now() - 1 });
            }
          },
          { instanceName: '' },
        );
        assert.equal(
          (
            await send(
              'tools/call',
              { name: studentSelectName, arguments: { name: 'Student' } },
              { headers: { authorization: `Bearer ${token}` } },
            )
          ).status,
          401,
        );
      }
      const insufficient = await redeemBearer();
      await app.bean.executor.mockCtx(
        async () => {
          await app
            .scope('mcp-auth')
            .model.authorization.builderSelect()
            .where({ tokenDigest: await issuedTokenDigest(insufficient) })
            .update({ scope: '' });
        },
        { instanceName: '' },
      );
      const forbidden = await send(
        'tools/call',
        { name: studentSelectName, arguments: { name: 'Student' } },
        { headers: { authorization: `Bearer ${insufficient}` } },
      );
      assert.equal(forbidden.status, 401);
      assert.match(String(forbidden.headers['www-authenticate']), /error="invalid_token"/);
      assert.equal(held.mock.callCount(), 0);
      const config = app.config.modules['mcp-auth'];
      const contexts = mcpTransportSnapshot(app)?.contexts;
      try {
        app.config.modules['mcp-auth'] = { ...config, tokenTtl: 0 };
        assert.equal((await send('tools/list')).status, 503);
        assert.equal(mcpTransportSnapshot(app)?.contexts, contexts);
      } finally {
        app.config.modules['mcp-auth'] = config;
      }
    } finally {
      held.mock.restore();
    }
  });

  it('rejects anonymous, cross-origin, missing-origin and GET decisions without changing pending state', async () => {
    const verifier = randomBytes(32).toString('base64url');
    const requestId = await app.bean.executor.mockCtx(
      async () =>
        app.scope('mcp-auth').service.authorization.authorize(
          new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            resource,
            scope: 'mcp:read',
            code_challenge_method: 'S256',
            code_challenge: createHash('sha256').update(verifier).digest('base64url'),
          }),
          { resource, instanceName: '' },
        ),
      { instanceName: '' },
    );
    ownedRequests.push(requestId);
    const readPending = async () =>
      app.bean.executor.mockCtx(
        async () =>
          app
            .scope('mcp-auth')
            .model.authorization.builderSelect()
            .where({ requestDigest: createHash('sha256').update(requestId).digest('hex') })
            .first(),
        { instanceName: '' },
      );
    const pending = await readPending();
    assert.ok(pending);
    assert.equal(pending.state, 'pending');
    const body = JSON.stringify({ request: requestId, allow: true });
    for (const [headers, status] of [
      [{ origin }, 401],
      [{ authorization: `Bearer ${browserToken}`, origin: 'https://attacker.example.test' }, 403],
      [{ authorization: `Bearer ${browserToken}` }, 403],
    ] as [OutgoingHttpHeaders, number][]) {
      const rejected = await openHttp({ target: '/mcp/auth/decision', headers, body }).response;
      assert.equal(rejected.status, status);
      assert.deepEqual(await readPending(), pending);
    }
    const get = await openHttp({
      method: 'GET',
      target: `/mcp/auth/decision?request=${encodeURIComponent(requestId)}&allow=true`,
      headers: { authorization: `Bearer ${browserToken}`, origin },
    }).response;
    assert.ok(get.status === 404 || get.status === 405);
    assert.deepEqual(await readPending(), pending);
  });

  it('drains actual approved-Action work without closing the shared listener', async t => {
    if (trainingDisabled) {
      await closeMcpTransport(app);
      assert.equal(mcpTransportSnapshot(app)?.closing, true);
      assert.equal((await send('tools/list')).status, 503);
      assert.ok(app.server?.listening);
      return;
    }
    const { ServiceStudent } = await import('vona-module-training-student');
    const off = allowStudentAction('select');
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let entered = false;
    let workFinished = false;
    const original = ServiceStudent.prototype.select;
    const held = t.mock.method(
      ServiceStudent.prototype,
      'select',
      async function (
        this: InstanceType<typeof ServiceStudent>,
        ...args: Parameters<InstanceType<typeof ServiceStudent>['select']>
      ) {
        entered = true;
        await barrier;
        try {
          return await original.apply(this, args);
        } finally {
          workFinished = true;
        }
      },
    );
    const pending = send('tools/call', {
      name: studentSelectName,
      arguments: { name: randomUUID() },
    });
    try {
      await waitFor(() => entered);
      let closed = false;
      const closure = app.meta.modules['cabloy-mcp'].monkeyInstance.appClose!().then(() => {
        closed = true;
      });
      await delay(25);
      assert.equal(closed, false, 'transport cancellation is not actual work settlement');
      assert.equal(workFinished, false);
      assert.equal(mcpTransportSnapshot(app)?.active, 1);
      assert.equal(
        (await openHttp({ headers: { authorization: `Bearer ${bearer}` } }).response).status,
        503,
        'closing denies new work while old work drains',
      );
      resume();
      await closure;
      assert.equal(workFinished, true);
      assert.equal((await pending).status, 503);
      assert.equal(mcpTransportSnapshot(app)?.active, 0);
      assert.equal(mcpTransportSnapshot(app)?.closing, true);
      assert.equal((await send('tools/list')).status, 503);
      assert.ok(app.server?.listening);
      const metadata = await openHttp({
        method: 'GET',
        target: '/.well-known/oauth-protected-resource/mcp',
      }).response;
      assert.equal(metadata.status, 200, 'ordinary routes retain the shared listener');
    } finally {
      resume();
      try {
        await closeMcpTransport(app);
        await pending;
      } finally {
        off();
        held.mock.restore();
      }
    }
  });
});
