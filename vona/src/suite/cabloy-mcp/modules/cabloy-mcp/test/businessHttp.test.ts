import type {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'node:http';
import type { VonaApplication } from 'vona';

import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { request } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import { BeanExecutor } from 'vona-module-a-executor';
import {
  closeMcpTransport,
  fixtureIngressLimits,
  handleMcpRequest,
  mcpTransportSnapshot,
} from 'vona-module-cabloy-mcp';
import { getMcpIssuer } from 'vona-module-mcp-auth';

const version = '2026-07-28';
const categoriesName = 'commerce_categories_list';
const searchName = 'commerce_products_search';
const detailName = 'commerce_product_detail';
const studentSummaryName = 'training_student_summary';
const studentLookupName = 'training_student_lookup';
const excludedNames = [
  categoriesName,
  searchName,
  detailName,
  'mcp_test_action_status',
  'mcp_test_action_effect',
  'mcp_test_action_scalar',
  'mcp_test_action_array',
  'mcp_test_action_unsupported',
  'mcp-test_toolFixture_closed',
  'training-student_student_select',
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

async function redeemBearer(scope: 'mcp:all' | 'mcp:read' = 'mcp:read') {
  const verifier = randomBytes(32).toString('base64url');
  const requestId = await app.bean.executor.mockCtx(
    async () => {
      return await app.scope('mcp-auth').service.authorization.authorize(
        new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
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
    body: JSON.stringify({ request: requestId, allow: true }),
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
      client_id: clientId,
      redirect_uri: redirectUri,
      resource,
      code,
      code_verifier: verifier,
    }).toString(),
  }).response;
  assert.equal(token.status, 200);
  assert.equal(token.body.token_type, 'Bearer');
  assert.equal(token.body.scope, scope);
  assert.equal('refresh_token' in token.body, false);
  return token.body.access_token as string;
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

function allowStudentAction(action: 'lookup' | 'summary') {
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
        grant_types: ['authorization_code', 'refresh_token'],
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
            await app.scope('mcp-auth').model.client.delete({ clientId: dynamicClientId });
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
        listed.body.result.tools,
        [],
        'ordinary OAuth identity has no student grants',
      );
      if (trainingDisabled) {
        for (const [name, args] of [
          [studentLookupName, { name: 'Student' }],
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

  it('makes known synthetic and unapproved sibling names uncallable under both scopes and transports', async t => {
    const allToken = await redeemBearer('mcp:all');
    const original = BeanExecutor.prototype.performAction;
    const observed = t.mock.method(
      BeanExecutor.prototype,
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

  it('denies production and unknown modes before any downstream application or request access', async () => {
    for (const meta of [
      { isDev: false, isTest: false, mode: 'production' },
      { isDev: false, isTest: false, mode: 'unknown' },
      {},
    ]) {
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

  it('discovers only currently authorized student Actions without business reads and reauthorizes calls', async t => {
    if (trainingDisabled) return;
    assert.ok(app.meta.modules['training-student']);
    const allToken = await redeemBearer('mcp:all');
    const { ControllerStudent, ModelStudent, ServiceStudent } =
      await import('vona-module-training-student');
    const business = [
      t.mock.method(ControllerStudent.prototype, 'lookup'),
      t.mock.method(ControllerStudent.prototype, 'summary'),
      t.mock.method(ServiceStudent.prototype, 'lookup'),
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
      { permissions: ['select'], names: [studentLookupName] },
      { permissions: ['view'], names: [studentSummaryName] },
      { permissions: ['select', 'view'], names: [studentLookupName, studentSummaryName] },
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
          const names = tools.map((tool: any) => tool.name) as string[];
          assert.deepEqual(
            names.toSorted(),
            state.names.toSorted(),
            'only the exact approved Actions are admitted',
          );
          assert.deepEqual(
            policyCalls.slice(before),
            [`${controller}#lookup`, `${controller}#summary`],
            'each list freshly checks the actual registered Actions',
          );
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
        assert.equal(
          visible.body.result.tools.some((tool: any) => tool.name === studentSummaryName),
          true,
        );
        granted = [];
        for (const [name, args] of [
          [studentLookupName, { name: 'unused' }],
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
        assert.deepEqual(
          recovered.body.result.tools
            .filter((tool: any) => [studentLookupName, studentSummaryName].includes(tool.name))
            .map((tool: any) => tool.name),
          [studentSummaryName],
        );
        for (const spy of business) assert.equal(spy.mock.callCount(), 0);
      }
    } finally {
      off();
      for (const spy of business) spy.mock.restore();
    }
    const after = await send('tools/list', {}, { headers: { authorization: `Bearer ${bearer}` } });
    assert.equal(
      after.body.result.tools.some((tool: any) =>
        [studentLookupName, studentSummaryName].includes(tool.name),
      ),
      false,
      'test policy was removed',
    );
  });

  it('guards independent student lookup and summary with current roles across modern/legacy read scopes and instance boundaries', async t => {
    if (trainingDisabled) return;
    assert.ok(app.meta.modules['training-student']);
    assert.ok(fixtureUserId);
    const userId = fixtureUserId;
    const name = `MCP student ${randomUUID()}`;
    const mobile = '13812345678';
    const descriptionMarkdown = `# Private student notes\n\n${randomUUID()}`;
    const level = 2;
    let studentId: string | undefined;
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
    const original = BeanExecutor.prototype.performAction;
    const observed = t.mock.method(
      BeanExecutor.prototype,
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
    const lookup = (query: Record<string, unknown>, token = bearer, legacy = false) =>
      send(
        'tools/call',
        { name: studentLookupName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const errorResult = (response: Awaited<ReturnType<typeof send>>, text: string) => {
      assert.equal(response.status, 200);
      assert.equal(response.body.error, undefined);
      assert.equal(response.body.result.isError, true);
      assert.equal(response.body.result.structuredContent, undefined);
      assert.deepEqual(response.body.result.content, [{ type: 'text', text }]);
      return response.body.result;
    };
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const training = app.scope('training-student');
          const student = await training.model.student.insert({ name, mobile, level });
          studentId = String(student.id);
          await training.model.studentContent.insert({
            studentId: student.id,
            descriptionMarkdown,
            descriptionHtml: app.bean.markdown.renderHtml(descriptionMarkdown),
          });
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
          const student = await app.scope('training-student').model.student.insert({
            name,
            mobile,
            level,
          });
          otherStudentId = String(student.id);
        },
        { instanceName: 'shareTest' as any },
      );
      assert.ok(studentId);
      assert.ok(otherStudentId);
      assert.ok(adminRoleId);
      // Neither OAuth scope grants ordinary users student-select or student-view authority.
      for (const token of [bearer, allToken]) {
        errorResult(await lookup({ name }, token), 'Action failed');
        errorResult(await call(studentId, token), 'Action failed');
        assert.equal(observedCalls.at(-1)!.roleNames.includes('systemAdmin'), false);
      }
      // A test-only policy separates select from view without adding any role membership.
      const { ServiceStudent } = await import('vona-module-training-student');
      const summary = t.mock.method(ServiceStudent.prototype, 'summary');
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
          const foundResponse = await lookup({ name }, token, legacy);
          const found = output(foundResponse);
          assert.deepEqual(found, {
            list: [{ id: studentId, name, level }],
            total: '1',
            pageNo: 1,
            pageSize: 10,
            pageCount: 1,
          });
          const deniedResponse = await call(found.list[0].id, token, legacy);
          errorResult(deniedResponse, 'Action failed');
          assert.equal(summary.mock.callCount(), 0, 'view denial prevents summary service work');
          for (const response of [foundResponse, deniedResponse]) {
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
              { action: 'lookup', policyActionKey: `${controllerBeanFullName}#select` },
              { action: 'summary', policyActionKey: `${controllerBeanFullName}#view` },
            ])
            .flat(),
          'the real guard resolves distinct inherited permissions on every transport/scope pair',
        );
        viewOnly = true;
        for (const { token, legacy } of [bearer, allToken].flatMap(token =>
          [false, true].map(legacy => ({ token, legacy })),
        )) {
          errorResult(await lookup({ name }, token, legacy), 'Action failed');
          const independent = output(await call(studentId, token, legacy));
          assert.equal(
            independent.id,
            studentId,
            'summary accepts an authorized ID without a successful lookup',
          );
          assert.deepEqual(Object.keys(independent).sort(), studentSummaryFields);
        }
        assert.equal(summary.mock.callCount(), 4);
      } finally {
        off();
        summary.mock.restore();
      }
      errorResult(await lookup({ name }), 'Action failed');
      errorResult(await call(studentId), 'Action failed');
      assert.equal(policyCalls.length, 16, 'the exact test policy listener was removed');
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
        const foundResponse = await lookup({ name: `  ${name}  `, level }, token, legacy);
        const found = output(foundResponse);
        assert.deepEqual(found, {
          list: [{ id: studentId, name, level }],
          total: '1',
          pageNo: 1,
          pageSize: 10,
          pageCount: 1,
        });
        const lookupCall = observedCalls.at(-1)!;
        assert.equal(lookupCall.path, '/training/student/lookup');
        assert.deepEqual(lookupCall.options, {
          query: { name, level, pageNo: 1, pageSize: 10 },
          innerAccess: false,
        });
        assert.equal(JSON.stringify(foundResponse.body.result).includes(mobile), false);
        const response = await call(found.list[0].id, token, legacy);
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
      const missing = errorResult(await call('-1'), 'Resource not found');
      const otherInstance = errorResult(await call(otherStudentId), 'Resource not found');
      assert.deepEqual(otherInstance, missing);
      for (const current of observedCalls) {
        assert.equal(current.method, 'get');
        if (current.path === '/training/student/summary/:id') {
          const options = current.options as { params: { id: string }; innerAccess: boolean };
          assert.deepEqual(options, { params: { id: options.params.id }, innerAccess: false });
        } else {
          assert.equal(current.path, '/training/student/lookup');
          assert.equal((current.options as { innerAccess: boolean }).innerAccess, false);
        }
        assert.equal(current.userId, userId);
        assert.equal(current.authId, fixtureAuthId);
      }
      assert.equal(observedCalls.length, 32, 'every read traverses its fixed guarded action');
      await app.bean.executor.mockCtx(
        async () => {
          assert.equal(await app.bean.role.removeUserId(adminRoleId!, userId), true);
          membershipOwned = false;
        },
        { instanceName: '' },
      );
      errorResult(await lookup({ name }), 'Action failed');
      errorResult(await call(studentId), 'Action failed');
      assert.equal(observedCalls.at(-1)!.roleNames.includes('systemAdmin'), false);
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
                await app
                  .scope('training-student')
                  .model.studentContent.delete({ studentId }, { disableDeleted: true });
                await app
                  .scope('training-student')
                  .model.student.deleteById(studentId, { disableDeleted: true });
              }
            },
            { instanceName: '' },
          );
        } finally {
          if (otherStudentId) {
            await app.bean.executor.mockCtx(
              async () => {
                await app
                  .scope('training-student')
                  .model.student.deleteById(otherStudentId!, { disableDeleted: true });
              },
              { instanceName: 'shareTest' as any },
            );
          }
        }
      } finally {
        observed.mock.restore();
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
    assert.deepEqual(metadata.body.grant_types_supported, ['authorization_code']);
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
    assert.equal(refresh.body.error, 'invalid_request');
    assert.equal(refresh.headers['cache-control'], 'no-store');
    const unsupportedGrant = await openHttp({
      target: '/mcp/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        resource,
      }).toString(),
    }).response;
    assert.equal(unsupportedGrant.status, 400);
    assert.equal(unsupportedGrant.body.error, 'unsupported_grant_type');
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
      assert.deepEqual(listed.body.result.tools, []);
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

  it('installs current server-owned Passport into approved Actions without forwarding bearer credentials', async t => {
    if (trainingDisabled) return;
    const { ServiceStudent } = await import('vona-module-training-student');
    const original = ServiceStudent.prototype.lookup;
    const off = allowStudentAction('lookup');
    const observed = t.mock.method(
      ServiceStudent.prototype,
      'lookup',
      async function (
        this: InstanceType<typeof ServiceStudent>,
        ...args: Parameters<InstanceType<typeof ServiceStudent>['lookup']>
      ) {
        assert.equal(String(this.bean.passport.currentUser?.id), fixtureUserId);
        assert.equal(String(this.bean.passport.currentAuth?.id), fixtureAuthId);
        assert.ok(this.bean.passport.isAuthenticated);
        assert.equal(this.ctx.innerAccess, false);
        assert.equal(this.ctx.req.headers.authorization, undefined);
        assert.equal(this.ctx.req.headers.cookie, undefined);
        assert.equal(this.ctx.req.headers['proxy-authorization'], undefined);
        return await original.apply(this, args);
      },
    );
    try {
      output(
        await send('tools/call', { name: studentLookupName, arguments: { name: randomUUID() } }),
      );
      assert.equal(observed.mock.callCount(), 1);
    } finally {
      off();
      observed.mock.restore();
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
    const held = t.mock.method(BeanExecutor.prototype, 'performAction', async () => {
      throw new Error('unauthorized business dispatch');
    });
    try {
      for (const token of ['a'.repeat(43), browserToken]) {
        const denied = await send(
          'tools/call',
          { name: studentLookupName, arguments: { name: 'Student' } },
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
                .where({ tokenDigest: createHash('sha256').update(token).digest('hex') })
                .update({ tokenExpiresAt: Date.now() - 1 });
            }
          },
          { instanceName: '' },
        );
        assert.equal(
          (
            await send(
              'tools/call',
              { name: studentLookupName, arguments: { name: 'Student' } },
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
            .where({ tokenDigest: createHash('sha256').update(insufficient).digest('hex') })
            .update({ scope: '' });
        },
        { instanceName: '' },
      );
      const forbidden = await send(
        'tools/call',
        { name: studentLookupName, arguments: { name: 'Student' } },
        { headers: { authorization: `Bearer ${insufficient}` } },
      );
      assert.equal(forbidden.status, 403);
      assert.match(String(forbidden.headers['www-authenticate']), /error="insufficient_scope"/);
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
    const off = allowStudentAction('lookup');
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let entered = false;
    let workFinished = false;
    const original = ServiceStudent.prototype.lookup;
    const held = t.mock.method(
      ServiceStudent.prototype,
      'lookup',
      async function (
        this: InstanceType<typeof ServiceStudent>,
        ...args: Parameters<InstanceType<typeof ServiceStudent>['lookup']>
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
      name: studentLookupName,
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
