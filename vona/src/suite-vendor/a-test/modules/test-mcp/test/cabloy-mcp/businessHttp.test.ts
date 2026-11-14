import type {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'node:http';
import type { TestContext } from 'node:test';
import type { Constructable, VonaApplication } from 'vona';
import type { IMcpToolCatalogItem, IMcpToolIdentity, TypeMcpScope } from 'vona-module-mcp-auth';
import type { DtoStudentCreate, DtoStudentUpdate } from 'vona-module-training-student';

import { fromJsonSchema } from '@modelcontextprotocol/server';
import fse from 'fs-extra';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { request } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { isDeepStrictEqual } from 'node:util';
import { appResource, AppUtil } from 'vona';
import { acquireTestLock, app } from 'vona-mock';
import { BeanExecutor } from 'vona-module-a-executor';
import { ServiceRateLimit } from 'vona-module-a-ratelimit';
import { BeanRbacScope } from 'vona-module-a-rbac';
import {
  closeMcpTransport,
  fixtureIngressLimits,
  handleMcpRequest,
  mcpTransportSnapshot,
  toolSchema,
  queryRepairHint,
  resolveSchema,
} from 'vona-module-cabloy-mcp';
import { getMcpIssuer, resolveMcpInstance, ServiceAuthorization } from 'vona-module-mcp-auth';

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
const contractName = 'cabloy_tool_contract';
const logoutName = 'cabloy_logout';
const logoutResult = {
  loggedOut: true,
  message:
    'Current MCP authorization revoked. All connections sharing it lose access. Reconnect with a new authorization or personal access token.',
};
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
  'test-mcp_catalog_excluded',
  'test-mcp_toolFixture_excluded',
  'test-mcp_toolFixture_closed',
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
let studentBearer: string;
let origin: string;
let resource: string;
let studentResource: string;
let fixtureStudentRoleId: string | undefined;
let clientId: string;
let dynamicClientId: string | undefined;
let redirectUri: string;
let fixtureUserId: string | undefined;
let fixtureAuthId: string | undefined;
let fixtureAuthSimpleId: string | undefined;
let browserToken: string;
const ownedRequests: string[] = [];
const requestOwner = randomUUID();

function mockOwnedPerformAction(
  t: TestContext,
  implementation: (
    this: BeanExecutor,
    ...args: Parameters<BeanExecutor['performAction']>
  ) => Promise<any>,
) {
  const executor = app.bean.executor;
  const original = executor.performAction;
  const owned = t.mock.fn(implementation);
  // The executor is application-owned; count and intercept only this suite's HTTP requests.
  // Do not filter by Passport identity: the callbacks must still detect incorrect admission.
  const installed = t.mock.method(
    executor,
    'performAction',
    async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
      if (app.ctx?.get('x-mcp-test-owner') !== requestOwner) {
        return await original.apply(this, args);
      }
      return await owned.apply(this, args);
    },
  );
  return {
    mock: {
      callCount: () => owned.mock.callCount(),
      restore: () => installed.mock.restore(),
    },
  };
}

async function redeemTokens(
  scope: 'mcp:all' | 'mcp:read' = 'mcp:read',
  oauthClientId = clientId,
  effectiveScope?: TypeMcpScope,
  ssrSiteId = 'web',
) {
  const resource = `${getMcpIssuer(app)}/${ssrSiteId}`;
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
        { resource, instanceName: '', ssrSiteId },
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

async function redeemBearer(scope: 'mcp:all' | 'mcp:read' = 'mcp:read', ssrSiteId = 'web') {
  const token = await redeemTokens(scope, clientId, undefined, ssrSiteId);
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
    path: options.target ?? '/mcp/web',
    method: options.method ?? 'POST',
    agent: false,
    headers: {
      'host': new URL(origin).host,
      'content-type': 'application/json',
      'accept': 'application/json, text/event-stream',
      'connection': 'close',
      'x-mcp-test-owner': requestOwner,
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

function sendStudent(
  method: string,
  params: Record<string, unknown> = {},
  options: { headers?: OutgoingHttpHeaders; legacy?: boolean } = {},
) {
  return send(method, params, {
    ...options,
    target: '/mcp/admin',
    headers: { authorization: `Bearer ${studentBearer}`, ...options.headers },
  });
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

function studentActionIsScoped(action: string) {
  const descriptor = app.bean.rbacCatalog
    .getCatalog()
    .get(`training-student.controller.student#${action}`);
  assert.ok(descriptor, `Student ${action} is registered in the native RBAC catalog`);
  return Boolean(descriptor.options.dataScope);
}

function studentPolicyTerms(action: string) {
  // Unscoped admission must remain effective without matcher terms.
  return studentActionIsScoped(action) ? { terms: [{ dataScope: 'all' as const }] } : {};
}

function mockStudentCreateOwnerValues(t: TestContext) {
  if (!studentActionIsScoped('create')) return undefined;
  const prototype = BeanRbacScope.prototype as any;
  const original = prototype.prepareDefaultOwnerValues;
  return t.mock.method(
    prototype,
    'prepareDefaultOwnerValues',
    async function (this: BeanRbacScope) {
      const route = this.ctx.route;
      if (
        fixtureUserId !== undefined &&
        this.ctx.get('x-mcp-test-owner') === requestOwner &&
        this.ctx.instanceName === '' &&
        String(this.bean.passport.currentUser?.id) === fixtureUserId &&
        route?.controllerBeanFullName === 'training-student.controller.student' &&
        route.action === 'create'
      ) {
        return { departmentId: null, userIdOwner: fixtureUserId };
      }
      return await original.call(this);
    },
  );
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
      ...studentPolicyTerms(request.action.action),
    };
  });
}

// The root managed test runner owns this listener and disposable instance state.
// No test creates another application/listener or changes global origin configuration.
// This budget covers all serial scenarios, including concurrent CI coverage overhead.
describe('businessHttp.test.ts', { concurrency: false, timeout: 180000 }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    assert.ok(app.server?.listening, 'managed application listener must be enabled');
    const address = app.server.address();
    assert.ok(address && typeof address === 'object');
    port = address.port;
    resource = `${getMcpIssuer(app)}/web`;
    studentResource = `${getMcpIssuer(app)}/admin`;
    origin = new URL(resource).origin;
    redirectUri = `${origin}/mcp-test-callback`;
    release = await acquireTestLock('test-mcp');
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
        const studentRole = await app.scope('home-user').model.role.insert({
          name: `mcp-student-admin-${randomUUID()}`,
          title: 'Owned Student MCP Admin admission',
          siteIds: ['admin'],
          builtin: false,
          mcpAccess: true,
        });
        fixtureStudentRoleId = String(studentRole.id);
        const roles = await app.bean.role.findAllByUserId(user.id);
        await app.bean.role.replaceUserRoleIds(user.id, [
          ...(roles ?? []).map(role => role.id),
          studentRole.id,
        ]);
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
    studentBearer = await redeemBearer('mcp:read', 'admin');
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
          if (fixtureStudentRoleId) {
            await app.scope('home-user').model.role.deleteById(fixtureStudentRoleId);
          }
        },
        { instanceName: '' },
      );
    } finally {
      release?.();
    }
  });

  it('isolates site catalogs, scope names, credentials and management mutations over real HTTP', async () => {
    const ids: string[] = [];
    const scopeIds: string[] = [];
    let roleId: string | undefined;
    let previousRoles: string[] = [];
    const management = (
      kind: string,
      action: string,
      site: string,
      method = 'GET',
      body?: object,
    ) =>
      openHttp({
        target: `${app.util.combineApiPath(`/mcp/auth/${kind}/${action}`, '', true, true)}?ssrSiteId=${site}`,
        method,
        headers: { authorization: `Bearer ${browserToken}`, origin },
        body: body === undefined ? undefined : JSON.stringify(body),
      }).response;
    try {
      await app.bean.executor.mockCtx(async () => {
        previousRoles = ((await app.bean.role.findAllByUserId(fixtureUserId!)) ?? []).map(role =>
          String(role.id),
        );
        const role = await app.scope('home-user').model.role.insert({
          name: `mcp-sites-${randomUUID()}`,
          title: 'Owned cross-site MCP admission',
          siteIds: ['web', 'admin'],
          builtin: false,
          mcpAccess: true,
        });
        roleId = String(role.id);
        await app.bean.role.replaceUserRoleIds(fixtureUserId!, [...previousRoles, role.id]);
      });
      const name = `Cross-site-${randomUUID()}`;
      const tokens: Record<string, string> = {};
      const definitions: Record<string, { id: string; scope: string }> = {};
      for (const site of ['web', 'admin']) {
        const catalog = await management('customScope', 'catalog', site);
        assert.equal(catalog.status, 200);
        const tools = catalog.body.data as IMcpToolCatalogItem[];
        assert.equal(
          tools.some(tool => tool.name === 'mcp_test_action_scalar'),
          site === 'web',
        );
        const selected = tools.find(
          tool =>
            tool.name === (site === 'web' ? 'mcp_test_action_scalar' : 'mcp_test_action_array'),
        );
        assert.ok(selected);
        const created = await management('customScope', 'createMine', site, 'POST', {
          name,
          description: 'Same owner and name, different site authority',
          tools: [
            { name: selected.name, controller: selected.controller, action: selected.action },
          ],
        });
        assert.equal(created.status, 200);
        scopeIds.push(String(created.body.data.id));
        definitions[site] = created.body.data;
        assert.equal(created.body.data.resource, `${origin}/mcp/${site}`);
        const token = await management('accessToken', 'createMine', site, 'POST', {
          name,
          scope: created.body.data.scope,
        });
        assert.equal(token.status, 200);
        ids.push(String(token.body.data.id));
        tokens[site] = token.body.data.accessToken;
      }
      assert.equal(definitions.web.scope, definitions.admin.scope);
      assert.notEqual(String(definitions.web.id), String(definitions.admin.id));
      for (const site of ['web', 'admin']) {
        const own = await management('accessToken', 'mine', site);
        assert.deepEqual(
          own.body.data.list.map((row: any) => String(row.id)),
          [ids[site === 'web' ? 0 : 1]],
        );
        const scopes = await management('customScope', 'mine', site);
        assert.deepEqual(
          scopes.body.data.list.map((row: any) => String(row.id)),
          [String(definitions[site].id)],
        );
        const listed = await send(
          'tools/list',
          {},
          { target: `/mcp/${site}`, headers: { authorization: `Bearer ${tokens[site]}` } },
        );
        assert.equal(listed.status, 200);
        const selectedName = site === 'web' ? 'mcp_test_action_scalar' : 'mcp_test_action_array';
        assert.ok(listed.body.result.tools.some((tool: any) => tool.name === selectedName));
        assert.equal(
          (
            await send(
              'tools/call',
              { name: selectedName },
              { target: `/mcp/${site}`, headers: { authorization: `Bearer ${tokens[site]}` } },
            )
          ).status,
          200,
        );
        const otherSite = site === 'web' ? 'admin' : 'web';
        for (const method of ['tools/list', 'tools/call']) {
          const rejected = await send(
            method,
            method === 'tools/call' ? { name: selectedName } : {},
            { target: `/mcp/${otherSite}`, headers: { authorization: `Bearer ${tokens[site]}` } },
          );
          assert.equal(rejected.status, 401);
        }
      }
      const excluded = await send(
        'tools/call',
        { name: 'mcp_test_action_scalar' },
        { target: '/mcp/admin', headers: { authorization: `Bearer ${tokens.admin}` } },
      );
      assert.deepEqual(excluded.body.error, { code: -32602, message: 'Invalid params' });
      await management('accessToken', `deleteMine/${ids[0]}`, 'admin', 'DELETE');
      await management('customScope', `deleteMine/${definitions.web.id}`, 'admin', 'DELETE');
      assert.equal(
        (await send('tools/list', {}, { headers: { authorization: `Bearer ${tokens.web}` } }))
          .status,
        200,
      );
      const deleted = await management(
        'customScope',
        `deleteMine/${definitions.web.id}`,
        'web',
        'DELETE',
      );
      assert.equal(deleted.status, 200);
      assert.equal(
        (await send('tools/list', {}, { headers: { authorization: `Bearer ${tokens.web}` } }))
          .status,
        401,
      );
      assert.equal(
        (
          await send(
            'tools/list',
            {},
            { target: '/mcp/admin', headers: { authorization: `Bearer ${tokens.admin}` } },
          )
        ).status,
        200,
        'deleting a same-named Web scope never revokes Admin credentials',
      );
      for (const target of ['/mcp', '/mcp/missing']) {
        const rejected = await send('tools/list', {}, { target });
        assert.notEqual(rejected.status, 200, 'no legacy or unknown-site business ingress');
      }
    } finally {
      await app.bean.executor.mockCtx(async () => {
        for (const id of ids.toReversed())
          await app.scope('mcp-auth').model.authorization.deleteById(id);
        for (const id of scopeIds.toReversed())
          await app.scope('mcp-auth').model.customScope.deleteById(id);
        if (roleId) {
          await app.bean.role.replaceUserRoleIds(fixtureUserId!, previousRoles);
          await app.scope('home-user').model.role.deleteById(roleId);
        }
      });
    }
  });

  it('owns ingress and close exactly once and shares modern/legacy discovery on the managed listener', async () => {
    const owners = app.bean.onion.middlewareSystem
      .getOnionsEnabledCached()
      .map(item => item.beanOptions.beanFullName)
      .filter(name =>
        ['cabloy-mcp.middlewareSystem.mcp', 'test-mcp.middlewareSystem.mcp'].includes(name),
      );
    assert.deepEqual(owners, ['cabloy-mcp.middlewareSystem.mcp']);
    const closeOwners = app.meta.modulesMonkey.filter(
      module =>
        ['cabloy-mcp', 'test-mcp'].includes(module.info.relativeName) &&
        typeof module.monkeyInstance?.appClose === 'function',
    );
    assert.deepEqual(
      closeOwners.map(module => module.info.relativeName),
      ['cabloy-mcp'],
    );
    assert.ok(app.meta.modules['cabloy-mcp']);
    if ((process.env.PROJECT_DISABLED_MODULES ?? '').split(',').includes('test-mcp')) {
      assert.equal(app.meta.modules['test-mcp'], undefined);
    } else {
      assert.ok(app.meta.modules['test-mcp'], 'default composition retains the synthetic fixtures');
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
        assert.deepEqual(initialized.body.result.serverInfo, {
          name: app.meta.env.APP_NAME?.trim() || 'cabloy-mcp-actions',
          version: app.meta.env.APP_VERSION?.trim() || '0.1.0',
        });
      }
      const listed = await send('tools/list', {}, { legacy, headers });
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      assert.deepEqual(
        studentToolNames(listed.body.result.tools),
        [],
        'ordinary OAuth identity has no student grants',
      );
      if (app.meta.modules['test-mcp']) {
        const names = listed.body.result.tools.map((tool: any) => tool.name);
        for (const name of publicReadNames) {
          assert.ok(names.includes(name), 'public opted-in fixtures remain discoverable');
        }
        assert.equal(names.includes('mcp_test_action_effect'), token === allToken);
        assert.equal(
          names.includes(contractName),
          true,
          'visible nonquery Actions also expose the generic contract lookup',
        );
        assert.deepEqual(names.slice(-2), [contractName, logoutName]);
        assert.equal(names.includes('cabloy_query_capabilities'), false, 'the old tool is removed');
        const oldLookup = await send(
          'tools/call',
          { name: 'cabloy_query_capabilities', arguments: { tool: 'mcp_test_action_status' } },
          { legacy, headers },
        );
        assert.deepEqual(oldLookup.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(oldLookup.body.result, undefined);
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

  it('applies configured aggregate admission once before shared HTTP tool dispatch', async t => {
    const onion = app.bean.onion.middlewareSystem;
    const getOptions = onion.getOnionOptions;
    let options = {
      enable: true,
      rateLimit: { mode: 'enforce' as 'enforce' | 'observe', limit: 1 },
    };
    const configured = t.mock.method(onion, 'getOnionOptions', function (this: typeof onion, name) {
      const original = getOptions.call(this, name);
      if (name !== 'a-ratelimit:aggregate' || app.ctx?.get('x-mcp-test-owner') !== requestOwner) {
        return original;
      }
      return { ...original, ...options };
    });
    let admissions = 0;
    let unavailable = false;
    const admit = ServiceRateLimit.prototype.admitAggregate;
    const admission = t.mock.method(
      ServiceRateLimit.prototype,
      'admitAggregate',
      function (this: ServiceRateLimit, policy) {
        if (app.ctx?.get('x-mcp-test-owner') !== requestOwner) return admit.call(this, policy);
        admissions++;
        if (unavailable) return Promise.reject(new Error('private Redis detail'));
        return Promise.resolve({
          allowed: admissions === 1,
          limit: policy.limit,
          remaining: 0,
          resetAfterMs: 1000,
          retryAfterSeconds: 1,
        });
      },
    );
    const original = app.bean.executor.performAction;
    const dispatched = mockOwnedPerformAction(t, async function (...args) {
      return original.apply(this, args);
    });
    const call = (legacy = false) =>
      send(
        'tools/call',
        {
          name: 'mcp_test_action_status',
          arguments: {},
        },
        { legacy },
      );
    try {
      output(await call());
      assert.equal(admissions, 1, 'internal Action does not repeat application admission');
      assert.equal(dispatched.mock.callCount(), 1);
      for (const legacy of [false, true]) {
        const denied = await call(legacy);
        assert.equal(denied.status, 429);
        assert.equal(denied.headers['retry-after'], '1');
        assert.deepEqual(denied.body, {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Too Many Requests',
            data: { kind: 'rate_limit', status: 429, limit: 1, retryAfterSeconds: 1 },
          },
        });
        await waitFor(() => !mcpTransportSnapshot(app)?.active);
      }
      assert.equal(admissions, 3);
      assert.equal(dispatched.mock.callCount(), 1, 'aggregate denial never dispatches an Action');
      unavailable = true;
      const failed = await call();
      assert.equal(failed.status, 503);
      assert.equal(failed.headers['retry-after'], undefined);
      assert.deepEqual(failed.body.error, {
        code: -32000,
        message: 'Service Unavailable',
        data: { kind: 'rate_limit_unavailable', status: 503 },
      });
      assert.equal(dispatched.mock.callCount(), 1);
      options = { ...options, rateLimit: { ...options.rateLimit, mode: 'observe' } };
      output(await call());
      unavailable = false;
      output(await call());
      assert.equal(admissions, 6, 'observe still checks both unavailable and exhausted admission');
      options = { ...options, enable: false };
      output(await call());
      assert.equal(admissions, 6, 'disabled admission does not access the limiter');
      assert.equal(dispatched.mock.callCount(), 4);
    } finally {
      dispatched.mock.restore();
      admission.mock.restore();
      configured.mock.restore();
    }
  });

  it('preserves real Action identity-limit failures as safe tool results on both protocols', async t => {
    const redis = app.bean.redis;
    const get = redis.get;
    let unavailable = false;
    let commands = 0;
    const limiter = t.mock.method(redis, 'get', function (this: typeof redis, name) {
      if (name !== 'limiter' || app.ctx?.get('x-mcp-test-owner') !== requestOwner) {
        return get.call(this, name);
      }
      return {
        rateLimitAdmit: async (key: string, windowMs: string) => {
          commands++;
          assert.equal(windowMs, '60000');
          assert.match(key, /^rate-limit:v1:/);
          assert.match(decodeURIComponent(key), /get:\/mcp\/test\/actions\/status/);
          assert.equal(String(app.bean.passport.currentAuth?.id), fixtureAuthId);
          if (unavailable) throw new Error('private Redis detail');
          return [3, 60_000];
        },
      } as any;
    });
    const original = app.bean.executor.performAction;
    let spoof = false;
    const dispatched = mockOwnedPerformAction(t, async function (method, path, actionOptions) {
      if (spoof) {
        throw Object.assign(new Error('private action detail'), {
          code: 429,
          status: 429,
          errors: { kind: 'rate_limit', status: 429, limit: 2, retryAfterSeconds: 60 },
        });
      }
      return original.call(this, method, path, {
        ...actionOptions,
        onions: {
          interceptor: {
            'a-ratelimit:rateLimit': {
              enable: true,
              rateLimit: { mode: 'enforce', limit: 2, windowMs: 60_000, key: 'subject' },
            },
          },
        },
      });
    });
    const call = (legacy: boolean) =>
      send(
        'tools/call',
        {
          name: 'mcp_test_action_status',
          arguments: {},
        },
        { legacy },
      );
    try {
      for (const legacy of [false, true]) {
        unavailable = false;
        const denied = await call(legacy);
        assert.equal(denied.status, 200);
        assert.equal(denied.body.error, undefined);
        assert.equal(denied.body.result.isError, true);
        assert.equal(denied.body.result.structuredContent, undefined);
        assert.deepEqual(denied.body.result.content, [{ type: 'text', text: 'Too Many Requests' }]);
        assert.deepEqual(denied.body.result._meta['cabloy/rateLimit'], {
          kind: 'rate_limit',
          status: 429,
          limit: 2,
          retryAfterSeconds: 60,
        });
        unavailable = true;
        const failed = await call(legacy);
        assert.equal(failed.status, 200);
        assert.equal(failed.body.result.isError, true);
        assert.deepEqual(failed.body.result.content, [
          { type: 'text', text: 'Service Unavailable' },
        ]);
        assert.deepEqual(failed.body.result._meta['cabloy/rateLimit'], {
          kind: 'rate_limit_unavailable',
          status: 503,
        });
        spoof = true;
        const unrelated = await call(legacy);
        spoof = false;
        assert.equal(unrelated.status, 200);
        assert.equal(unrelated.body.result.isError, true);
        assert.deepEqual(unrelated.body.result.content, [{ type: 'text', text: 'Action failed' }]);
        assert.equal(unrelated.body.result._meta?.['cabloy/rateLimit'], undefined);
      }
      assert.equal(commands, 4, 'real identity interceptor calls its Redis admission service');
    } finally {
      dispatched.mock.restore();
      limiter.mock.restore();
    }
  });

  it('rejects an existing bearer before dispatch when its last granting role is removed and restores it on reassignment', async t => {
    assert.ok(fixtureUserId);
    const userId = fixtureUserId;
    const roleIds = await app.bean.executor.mockCtx(
      async () => {
        const roles = await app.bean.role.findAllByUserId(userId);
        assert.ok(roles);
        return roles.map(role => role.id);
      },
      { instanceName: '' },
    );
    assert.ok(roleIds.length);
    const original = app.bean.executor.performAction;
    const dispatched = mockOwnedPerformAction(t, async function (this: BeanExecutor, ...args) {
      return await original.apply(this, args);
    });
    try {
      await app.bean.executor.mockCtx(() => app.bean.role.replaceUserRoleIds(userId, []), {
        instanceName: '',
      });
      for (const method of ['tools/list', 'tools/call']) {
        const denied = await send(
          method,
          method === 'tools/call' ? { name: categoriesName, arguments: {} } : {},
        );
        assert.equal(denied.status, 401);
        assert.match(String(denied.headers['www-authenticate']), /error="invalid_token"/);
        assert.equal(denied.body.result, undefined);
      }
      assert.equal(
        dispatched.mock.callCount(),
        0,
        'lost MCP admission never reaches Action dispatch',
      );
    } finally {
      try {
        await app.bean.executor.mockCtx(() => app.bean.role.replaceUserRoleIds(userId, roleIds), {
          instanceName: '',
        });
      } finally {
        dispatched.mock.restore();
      }
    }
    const restored = await send('tools/list');
    assert.equal(restored.status, 200, 'the original bearer resumes without reissuance');
    assert.equal(restored.body.error, undefined);
  });

  it('resolves compact nonquery contracts from native metadata and executes unchanged Actions over both transports', async t => {
    if (!app.meta.modules['test-mcp']) return;
    const { ControllerToolFixture, toolFixtureState } = await import('vona-module-test-mcp');
    const effectName = 'mcp_test_action_effect';
    const initial = toolFixtureState.count;
    const allToken = await redeemBearer('mcp:all');
    const native = await app.bean.executor.mockCtx(
      async () => {
        const document = JSON.parse(
          JSON.stringify(
            await app.bean.openapi.generateJsonOfControllerAction(
              ControllerToolFixture,
              'effect',
              'V31',
              { includeExcluded: true, schemaTarget: 'mcp' },
            ),
          ),
        );
        const operation = Object.values(document.paths)
          .map((item: any) => item.post)
          .find(Boolean);
        const schemas = document.components.schemas;
        const body = toolSchema(operation.requestBody.content['application/json'].schema, schemas);
        const envelope = resolveSchema(
          operation.responses['200'].content['application/json'].schema,
          schemas,
        );
        return { body, output: toolSchema(envelope.properties.data, schemas) };
      },
      { instanceName: '' },
    );
    const original = app.bean.executor.performAction;
    const dispatched = mockOwnedPerformAction(t, async function (this: BeanExecutor, ...args) {
      return await original.apply(this, args);
    });
    try {
      for (const legacy of [false, true]) {
        const options = { legacy, headers: { authorization: `Bearer ${allToken}` } };
        const listed = await send('tools/list', {}, options);
        assert.equal(listed.body.error, undefined);
        const effect = listed.body.result.tools.find((tool: any) => tool.name === effectName);
        assert.ok(effect);
        assert.deepEqual(
          listed.body.result.tools.slice(-2).map((tool: any) => tool.name),
          [contractName, logoutName],
        );
        assert.deepEqual(Object.keys(effect.inputSchema.properties), ['params', 'body']);
        assert.equal(effect.inputSchema.properties.body.type, 'object');
        assert.equal(effect.inputSchema.properties.body.additionalProperties, true);
        assert.equal(effect.inputSchema.properties.body.properties, undefined);
        assert.match(effect.inputSchema.properties.body.description, /cabloy_tool_contract/);
        const lookup = (tool: string, section?: 'overview' | 'input' | 'output' | 'query') =>
          send(
            'tools/call',
            {
              name: contractName,
              arguments: { tool, ...(section === undefined ? {} : { section }) },
            },
            options,
          );
        const before = dispatched.mock.callCount();
        const overview = output(await lookup(effectName));
        assert.deepEqual(overview, {
          contractVersion: 1,
          tool: effectName,
          readOnly: false,
          sections: ['overview', 'input', 'output'],
          input: { type: 'object', compactPaths: [['body']] },
          output: { type: 'object', compactPaths: [] },
        });
        assert.deepEqual(output(await lookup(effectName, 'overview')), overview);
        const inputContract = output(await lookup(effectName, 'input'));
        const outputContract = output(await lookup(effectName, 'output'));
        for (const [section, contract] of [
          ['input', inputContract],
          ['output', outputContract],
        ]) {
          assert.deepEqual(Object.keys(contract).sort(), [
            'contractVersion',
            'schema',
            'section',
            'tool',
          ]);
          assert.equal(contract.contractVersion, 1);
          assert.equal(contract.tool, effectName);
          assert.equal(contract.section, section);
        }
        const fullBody = resolveSchema(
          inputContract.schema.properties.body,
          inputContract.schema.$defs ?? {},
        );
        assert.deepEqual(fullBody.properties, native.body.properties);
        assert.deepEqual(fullBody.required, native.body.required);
        assert.equal(
          fullBody.additionalProperties,
          false,
          'runtime mutation closure survives full lookup',
        );
        assert.deepEqual(outputContract.schema, native.output);
        const inputCheck = fromJsonSchema(inputContract.schema)['~standard'];
        const discoveryCheck = fromJsonSchema(effect.inputSchema)['~standard'];
        const args = {
          params: { label: `HTTP contract ${legacy ? 'legacy' : 'modern'}` },
          body: {
            amount: (native.body.properties as Record<string, any>).amount.minimum,
            priority: 0,
            note: null,
          },
        };
        assert.equal(args.body.amount, 1, 'input operands come from the native Action schema');
        assert.equal((await inputCheck.validate(args)).issues, undefined);
        const invalidArgs = { ...args, body: { ...args.body, amount: 4 } };
        assert.equal((await discoveryCheck.validate(invalidArgs)).issues, undefined);
        assert.ok(
          (await inputCheck.validate(invalidArgs)).issues,
          'full input retains amount constraints',
        );
        const invalid = await send(
          'tools/call',
          { name: effectName, arguments: invalidArgs },
          options,
        );
        assert.equal(invalid.body.error?.code, -32602);
        assert.equal(invalid.body.result, undefined);
        for (const tool of [effectName, 'unknown_contract_target', contractName]) {
          const unavailable = await lookup(tool, 'query');
          assert.deepEqual(unavailable.body.error, { code: -32602, message: 'Invalid params' });
          assert.equal(unavailable.body.result, undefined);
        }
        for (const section of ['overview', 'input', 'output'] as const) {
          const unavailable = await lookup('unknown_contract_target', section);
          assert.deepEqual(unavailable.body.error, { code: -32602, message: 'Invalid params' });
          assert.equal(unavailable.body.result, undefined);
        }
        const readDenied = await send(
          'tools/call',
          { name: contractName, arguments: { tool: effectName, section: 'input' } },
          { legacy, headers: { authorization: `Bearer ${bearer}` } },
        );
        assert.deepEqual(readDenied.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(
          dispatched.mock.callCount(),
          before,
          'metadata, lookup and invalid input never dispatch',
        );
        const count = toolFixtureState.count;
        const result = output(
          await send('tools/call', { name: effectName, arguments: args }, options),
        );
        assert.deepEqual(result, {
          count: count + 1,
          label: args.params.label,
          priority: 0,
          note: null,
        });
        assert.equal(
          (await fromJsonSchema(outputContract.schema)['~standard'].validate(result)).issues,
          undefined,
        );
        assert.equal(toolFixtureState.count, count + 1);
        assert.equal(
          dispatched.mock.callCount(),
          before + 1,
          'only the real Action call causes its effect',
        );
        for (const [tool, expected] of [
          ['mcp_test_action_scalar', { result: 7 }],
          ['mcp_test_action_array', { result: ['safe', 'array'] }],
        ] as const) {
          const contract = output(await lookup(tool, 'output'));
          assert.deepEqual(Object.keys(contract.schema.properties), ['result']);
          assert.deepEqual(contract.schema.required, ['result']);
          const wrapped = output(await send('tools/call', { name: tool, arguments: {} }, options));
          assert.deepEqual(wrapped, expected);
          assert.equal(
            (await fromJsonSchema(contract.schema)['~standard'].validate(wrapped)).issues,
            undefined,
          );
        }
      }
    } finally {
      dispatched.mock.restore();
      toolFixtureState.count = initial;
    }
  });

  it('makes unsupported, unannotated and unapproved sibling names uncallable under both scopes and transports', async t => {
    const allToken = await redeemBearer('mcp:all');
    const executor = app.bean.executor;
    const original = executor.performAction;
    const observed = mockOwnedPerformAction(
      t,
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
        const [listed] = await Promise.all([
          send('tools/list', {}, options),
          app.meta.modules['test-mcp']
            ? app.bean.executor.mockCtx(
                async () => {
                  const result = await app.bean.executor.performAction(
                    'get',
                    '/mcp/test/catalog/products',
                    {
                      query: { title: 'Wireless Headphones', pageNo: 1, pageSize: 1 },
                      innerAccess: false,
                    },
                  );
                  assert.equal(result.list.length, 1);
                  assert.equal(result.list[0].title, 'Wireless Headphones');
                },
                { instanceName: '' },
              )
            : undefined,
        ]);
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
    for (const scenario of [
      'ready',
      'not-ready',
      'closing',
      'disabled',
      'missing-authority',
      'wrong-host',
    ]) {
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
          if (name === 'a-ssr') {
            return {
              service: {
                ssr: { getSitesEnabled: () => [{ beanOptions: { options: { siteId: 'web' } } }] },
              },
            };
          }
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
              personalTokenTtl: 604800,
              allowLoopbackHttp: true,
            },
          },
        },
        createAnonymousContext(input: unknown) {
          contexts++;
          assert.deepEqual(input, {
            headers: { host: 'mcp.example.test' },
            method: 'POST',
            url: '/mcp/auth',
            socket: { encrypted: true },
          });
          return { instanceName: '' };
        },
        get bean() {
          return assert.fail('admission fixtures must not enter business execution');
        },
      } as unknown as VonaApplication;
      const util = new AppUtil();
      Object.defineProperty(util, 'app', { value: productionApp });
      Object.defineProperty(productionApp, 'util', { value: util });
      const req = {
        url: '/mcp/web',
        method: 'POST',
        rawHeaders: [
          'host',
          scenario === 'wrong-host' ? 'other.example.test' : 'mcp.example.test',
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
      assert.equal(
        status,
        scenario === 'ready' ? 401 : scenario === 'wrong-host' ? 400 : 503,
        scenario,
      );
      assert.equal(contexts, scenario === 'ready' ? 1 : 0, scenario);
      assert.equal(headers['cache-control'], 'no-store');
      assert.equal(
        headers['www-authenticate'],
        scenario === 'ready'
          ? 'Bearer resource_metadata="https://mcp.example.test/.well-known/oauth-protected-resource/mcp/web"'
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
    const allToken = await redeemBearer('mcp:all', 'admin');
    const {
      ControllerStudent,
      ModelStudent,
      ServiceStudent,
      DtoStudentCreate,
      DtoStudentUpdate,
      DtoStudentSelectResItem,
      DtoStudentView,
      DtoStudentSummary,
    } = await import('vona-module-training-student');
    const nativeLevelMetadata = await app.bean.executor.mockCtx(
      async () => {
        const classes = new Map<string, Constructable>([
          [studentCreateName, DtoStudentCreate],
          [studentUpdateName, DtoStudentUpdate],
          [studentSelectName, DtoStudentSelectResItem],
          [studentViewName, DtoStudentView],
          [studentSummaryName, DtoStudentSummary],
        ]);
        const document = JSON.parse(
          JSON.stringify(
            await app.bean.openapi.generateJsonOfClasses([...classes.values()], 'V31'),
          ),
        );
        return new Map(
          Array.from(classes, ([name, Class]) => {
            const schema = document.components.schemas[appResource.getBeanFullName(Class)!];
            const level = resolveSchema(schema.properties.level, document.components.schemas);
            assert.ok(level.title || level.description, `${name} has native level metadata`);
            if (name === studentCreateName) {
              assert.ok(level.rest, 'native OpenAPI retains UI metadata');
            }
            return [name, { title: level.title, description: level.description }];
          }),
        );
      },
      { instanceName: '' },
    );
    const assertLevelMetadata = (name: string, level: any) => {
      assert.deepEqual(
        { title: level.title, description: level.description },
        nativeLevelMetadata.get(name),
        `${name} retains native DTO level semantics`,
      );
      assert.equal(Object.hasOwn(level, 'rest'), false, `${name} omits UI metadata`);
      assert.equal(Object.hasOwn(level, 'errorMessage'), false, `${name} omits error templates`);
    };
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
      // Match the native Action's scope contract without adding terms to unscoped admission.
      return {
        allowed: granted.includes(request.policyActionKey),
        actionKey: request.action.actionKey,
        action: request.action,
        ...studentPolicyTerms(request.action.action),
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
      for (const { token, legacy } of [studentBearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        const options = { legacy, headers: { authorization: `Bearer ${token}` } };
        for (const state of states) {
          granted = state.permissions.map(permission => `${controller}#${permission}`);
          const before = policyCalls.length;
          const listed = await sendStudent('tools/list', {}, options);
          assert.equal(listed.status, 200);
          assert.equal(listed.body.error, undefined);
          const tools = listed.body.result.tools;
          const names = studentToolNames(tools);
          assert.equal(
            tools.some((tool: any) => tool.name === contractName),
            tools.some((tool: any) => ![contractName, logoutName].includes(tool.name)),
            'any visible Action, not just a query target, derives the generic lookup',
          );
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
          for (const tool of tools) {
            if (tool.name === studentDeleteName) continue;
            assert.ok(tool.description, `${tool.name} describes its existing Action contract`);
            if ([studentCreateName, studentUpdateName].includes(tool.name)) {
              const schema = tool.inputSchema;
              const body = resolveSchema(
                tool.name === studentCreateName ? schema : schema.properties.body,
                schema.$defs ?? {},
              );
              assertLevelMetadata(tool.name, body.properties.level);
            }
            if ([studentViewName, studentSummaryName].includes(tool.name)) {
              assertLevelMetadata(tool.name, tool.outputSchema.properties.level);
            }
            if (tool.name === studentSelectName) {
              const item = tool.outputSchema.properties.list.items;
              assert.equal(item.type, 'object');
              assert.equal(item.additionalProperties, true);
              assert.equal(item.properties, undefined, 'discovery omits the full list item schema');
              assert.match(item.description, /cabloy_tool_contract/);
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
        const visible = await sendStudent('tools/list', {}, options);
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
        const lookup = (
          tool: string,
          section: 'overview' | 'input' | 'output' | 'query' = 'query',
        ) =>
          sendStudent('tools/call', { name: contractName, arguments: { tool, section } }, options);
        assert.equal(output(await lookup(studentSelectName)).tool, studentSelectName);
        const selectOutput = output(await lookup(studentSelectName, 'output'));
        assert.deepEqual(Object.keys(selectOutput).sort(), [
          'contractVersion',
          'schema',
          'section',
          'tool',
        ]);
        assert.equal(selectOutput.contractVersion, 1);
        assert.equal(selectOutput.tool, studentSelectName);
        assert.equal(selectOutput.section, 'output');
        const selectItem = resolveSchema(
          selectOutput.schema.properties.list.items,
          selectOutput.schema.$defs ?? {},
        );
        assertLevelMetadata(studentSelectName, selectItem.properties.level);
        for (const section of ['overview', 'input', 'output'] as const) {
          const summaryContract = output(await lookup(studentSummaryName, section));
          assert.equal(summaryContract.contractVersion, 1);
          assert.equal(summaryContract.tool, studentSummaryName);
          if (section === 'overview') {
            assert.equal(summaryContract.readOnly, true);
            assert.deepEqual(summaryContract.sections, ['overview', 'input', 'output']);
            assert.equal(summaryContract.schema, undefined);
            assert.equal(summaryContract.input.schema, undefined);
            assert.equal(summaryContract.output.schema, undefined);
          } else {
            assert.equal(summaryContract.section, section);
            if (section === 'output') {
              assert.deepEqual(
                Object.keys(summaryContract.schema.properties).sort(),
                studentSummaryFields,
              );
              for (const field of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
                assert.equal(JSON.stringify(summaryContract.schema).includes(`"${field}"`), false);
              }
            }
          }
        }
        const nonquery = await lookup(studentSummaryName);
        assert.deepEqual(nonquery.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(
          nonquery.body.result,
          undefined,
          'visible nonquery target has no query section',
        );
        for (const spy of business) {
          assert.equal(spy.mock.callCount(), 0, 'contract lookup never executes business work');
        }
        granted = [];
        for (const section of ['overview', 'input', 'output'] as const) {
          const unavailable = await lookup(studentSummaryName, section);
          assert.equal(unavailable.status, 200);
          assert.deepEqual(unavailable.body.error, { code: -32602, message: 'Invalid params' });
          assert.equal(
            unavailable.body.result,
            undefined,
            'nonquery revocation is checked freshly',
          );
        }
        // HTTP deliberately sanitizes the mapper's Tool unavailable into Invalid params.
        for (const name of [
          studentSelectName,
          studentGroupName,
          studentAggregateName,
          studentSummaryName,
          'test-mcp_catalog_excluded',
          `client_${studentSelectName}`,
          'unknown_query_target',
        ]) {
          const unavailable = await lookup(name);
          assert.equal(unavailable.status, 200);
          assert.deepEqual(unavailable.body.error, { code: -32602, message: 'Invalid params' });
          assert.equal(unavailable.body.result, undefined);
        }
        for (const [name, args] of [
          [studentSelectName, { name: 'unused', pageNo: 1, pageSize: 1 }],
          [studentGroupName, { name: 'unused' }],
          [studentAggregateName, { name: 'unused' }],
          [studentViewName, { id: '-1' }],
          [studentSummaryName, { id: '-1' }],
        ] as const) {
          const denied = await sendStudent('tools/call', { name, arguments: args }, options);
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
        const failed = await sendStudent('tools/list', {}, options);
        assert.equal(failed.status, 200);
        assert.equal(failed.body.error.code, -32603);
        assert.equal(failed.body.result, undefined, 'no partial or unfiltered fallback');
        assert.equal(
          JSON.stringify(failed.body).includes('private discovery failure detail'),
          false,
        );
        broken = false;
        granted = [`${controller}#view`];
        const recovered = await sendStudent('tools/list', {}, options);
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
    const after = await sendStudent(
      'tools/list',
      {},
      { headers: { authorization: `Bearer ${studentBearer}` } },
    );
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
        ...studentPolicyTerms(request.action.action),
      };
    });
    const select = t.mock.method(ServiceStudent.prototype, 'select');
    const executor = app.bean.executor;
    const original = executor.performAction;
    const dispatched = mockOwnedPerformAction(
      t,
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
        target: `${app.util.combineApiPath(`/mcp/auth/customScope/${action}`, '', true, true)}?ssrSiteId=admin`,
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
          resource: studentResource,
        }).toString(),
      }).response;
    const assertInvalidated = async (token: { access_token: string; refresh_token?: string }) => {
      const before = dispatched.mock.callCount();
      const denied = await sendStudent(
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
      assert.equal(
        tools.some(tool => tool.name === contractName),
        false,
        'the derived lookup tool is not a consentable Action catalog entry',
      );
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
            resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
          ),
        { instanceName: '' },
      );
      oauthClientId = registration.client_id;
      // The helper asserts the token response is custom, never the requested all ceiling.
      const initial = await redeemTokens('mcp:all', oauthClientId, scope, 'admin');
      assert.ok(initial.refresh_token);
      const renewed = await refresh(initial.refresh_token);
      assert.equal(renewed.status, 200);
      assert.equal(renewed.body.scope, scope, 'refresh retains the exact approved subset');
      assert.ok(renewed.body.refresh_token);
      const token = renewed.body as { access_token: string; refresh_token: string };
      const listed = await sendStudent('tools/list', {}, options(token.access_token));
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name),
        [studentSelectName, contractName, logoutName],
        'one exact query grant derives lookup without granting sibling Actions',
      );
      const lookup = (tool: string, section: 'overview' | 'input' | 'output' | 'query' = 'query') =>
        sendStudent(
          'tools/call',
          { name: contractName, arguments: { tool, section } },
          options(token.access_token),
        );
      for (const section of ['overview', 'input', 'output'] as const) {
        const selectedContract = output(await lookup(studentSelectName, section));
        assert.equal(selectedContract.contractVersion, 1);
        assert.equal(selectedContract.tool, studentSelectName);
        for (const name of [sibling.name, view.name, contractName, 'unknown_contract_target']) {
          const unavailable = await lookup(name, section);
          assert.deepEqual(unavailable.body.error, { code: -32602, message: 'Invalid params' });
          assert.equal(unavailable.body.result, undefined, 'lookup never widens the exact subset');
        }
      }
      const contract = output(await lookup(studentSelectName));
      assert.equal(contract.grammarVersion, 1);
      assert.equal(contract.tool, studentSelectName);
      assert.equal(contract.bindings.length, 1);
      assert.deepEqual(contract.bindings[0].argumentPath, []);
      assert.equal(contract.bindings[0].mode, 'select');
      assert.equal(contract.bindings[0].querySchema.properties.where, undefined);
      for (const name of [sibling.name, view.name, contractName]) {
        const unavailable = await lookup(name);
        assert.deepEqual(unavailable.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(unavailable.body.result, undefined);
      }
      assert.equal(
        dispatched.mock.callCount(),
        0,
        'exact-scope lookup performs no Action dispatch',
      );
      assert.equal(select.mock.callCount(), 0);
      const excluded = await sendStudent(
        'tools/call',
        { name: sibling.name, arguments: {} },
        options(token.access_token),
      );
      assert.equal(excluded.status, 200);
      assert.equal(excluded.body.error?.code, -32602);
      assert.equal(excluded.body.result, undefined);
      assert.equal(dispatched.mock.callCount(), 0, 'authorized sibling is rejected predispatch');
      const leafCheck = fromJsonSchema({
        type: 'object',
        ...contract.bindings[0].predicates,
      })['~standard'];
      const where = { field: 'name', op: 'eq', value: `MCP custom scope absent ${randomUUID()}` };
      assert.equal((await leafCheck.validate(where)).issues, undefined);
      const query = { where, pageNo: 1, pageSize: 1 };
      const call = () =>
        sendStudent(
          'tools/call',
          { name: studentSelectName, arguments: query },
          options(token.access_token),
        );
      assert.deepEqual(output(await call()).list, []);
      assert.equal(dispatched.mock.callCount(), 1);
      assert.equal(select.mock.callCount(), 1, 'allowed tool executes its ordinary service');
      selectAllowed = false;
      for (const section of ['overview', 'input', 'output', 'query'] as const) {
        const deniedLookup = await lookup(studentSelectName, section);
        assert.deepEqual(deniedLookup.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(deniedLookup.body.result, undefined);
      }
      const revokedList = await sendStudent('tools/list', {}, options(token.access_token));
      assert.deepEqual(
        revokedList.body.result.tools.map((tool: any) => tool.name),
        [logoutName],
        'Action revocation removes derived lookup but retains authorization logout',
      );
      assert.equal(dispatched.mock.callCount(), 1, 'fresh target guards deny lookup predispatch');
      assert.equal(select.mock.callCount(), 1);
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
      const replacement = await redeemTokens('mcp:all', oauthClientId, scope, 'admin');
      const replacedList = await sendStudent('tools/list', {}, options(replacement.access_token));
      assert.equal(replacedList.status, 200);
      assert.deepEqual(
        replacedList.body.result.tools.map((tool: any) => tool.name),
        [studentViewName, contractName, logoutName],
        'an exact nonquery-only grant still derives generic contract lookup',
      );
      for (const legacy of [false, true]) {
        const replacedOptions = { legacy, ...options(replacement.access_token) };
        for (const section of ['overview', 'input', 'output'] as const) {
          const viewContract = output(
            await sendStudent(
              'tools/call',
              { name: contractName, arguments: { tool: studentViewName, section } },
              replacedOptions,
            ),
          );
          assert.equal(viewContract.tool, studentViewName);
          assert.equal(viewContract.contractVersion, 1);
          const excluded = await sendStudent(
            'tools/call',
            { name: contractName, arguments: { tool: studentSelectName, section } },
            replacedOptions,
          );
          assert.deepEqual(excluded.body.error, { code: -32602, message: 'Invalid params' });
          assert.equal(excluded.body.result, undefined);
        }
        const queryUnavailable = await sendStudent(
          'tools/call',
          { name: contractName, arguments: { tool: studentViewName, section: 'query' } },
          replacedOptions,
        );
        assert.deepEqual(queryUnavailable.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(queryUnavailable.body.result, undefined);
      }
      assert.equal(dispatched.mock.callCount(), 2, 'nonquery contracts also avoid Action dispatch');
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
    const suffix = randomUUID().slice(0, 8);
    const name = `MCP create ${suffix}`;
    const recordName = `MCP create record ${suffix}`;
    const subjectName = `MCP create subject ${suffix}`;
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
    const allToken = await redeemBearer('mcp:all', 'admin');
    const revokedToken = await redeemBearer('mcp:all', 'admin');
    const observedCalls: Array<{ method: unknown; path: unknown; options: any }> = [];
    const executor = app.bean.executor;
    const original = executor.performAction;
    const observed = mockOwnedPerformAction(
      t,
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
      sendStudent(
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
    const ownerValues = mockStudentCreateOwnerValues(t);
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
        const listed = await sendStudent(
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
        const readOptions = { legacy, headers: { authorization: `Bearer ${studentBearer}` } };
        const readList = await sendStudent('tools/list', {}, readOptions);
        assert.deepEqual(
          studentToolNames(readList.body.result.tools),
          [],
          'read scope hides even authorized create',
        );
        const before = observedCalls.length;
        const denied = await call(studentData, studentBearer, legacy);
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
            await sendStudent(
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
        ownerValues?.mock.restore();
      }
    }
  });

  it('creates a basic-fields-only student, updates its root and independently authorizes serialized MCP view', async t => {
    if (trainingDisabled) return;
    const suffix = randomUUID().slice(0, 8);
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
    const allToken = await redeemBearer('mcp:all', 'admin');
    let studentId: string | undefined;
    const contentIds = new Set<string>();
    let off = () => {};
    const ownerValues = mockStudentCreateOwnerValues(t);
    try {
      off = allowStudentAction('create');
      const response = await sendStudent(
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
          await sendStudent(
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
        await sendStudent(
          'tools/call',
          { name: studentViewName, arguments: { id: studentId } },
          { headers: { authorization: `Bearer ${studentBearer}` } },
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
      ownerValues?.mock.restore();
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
    const allToken = await redeemBearer('mcp:all', 'admin');
    const revokedToken = await redeemBearer('mcp:all', 'admin');
    const suffix = randomUUID().slice(0, 8);
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
            ...(studentActionIsScoped('update')
              ? { departmentId: null, userIdOwner: fixtureUserId! }
              : {}),
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
      const observed = mockOwnedPerformAction(
        t,
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
        sendStudent(
          'tools/call',
          { name: studentUpdateName, arguments: input },
          { legacy, headers: { authorization: `Bearer ${token}` } },
        );
      const list = (token = allToken, legacy = false) =>
        sendStudent('tools/list', {}, { legacy, headers: { authorization: `Bearer ${token}` } });
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
        assert.deepEqual(
          studentToolNames((await list(studentBearer, legacy)).body.result.tools),
          [],
        );
        const before = observedCalls.length;
        const readDenied = await call(args, studentBearer, legacy);
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
        await sendStudent(
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
          await sendStudent(
            'tools/call',
            { name: studentViewName, arguments: { id: target.id } },
            {
              legacy,
              headers: { authorization: `Bearer ${studentBearer}` },
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
      // Scoped Actions deny missing roots; unscoped void completion says nothing about existence.
      // Neither contract may enter nested writes.
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
        const absent = await call({ params: { id }, body: absentBody });
        if (studentActionIsScoped('update')) assertDenied(absent);
        else assertNull(absent);
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
    const allToken = await redeemBearer('mcp:all', 'admin');
    const revokedToken = await redeemBearer('mcp:all', 'admin');
    const suffix = randomUUID().slice(0, 8);
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
      const observed = mockOwnedPerformAction(
        t,
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
        sendStudent(
          'tools/call',
          { name: studentDeleteName, arguments: args },
          { legacy, headers: { authorization: `Bearer ${token}` } },
        );
      const list = (token = allToken) =>
        sendStudent('tools/list', {}, { headers: { authorization: `Bearer ${token}` } });
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
      assert.deepEqual(studentToolNames((await list(studentBearer)).body.result.tools), []);
      assert.equal(observedCalls.length, beforeList, 'delete listing performs no trial Action');
      const beforeInvalid = observedCalls.length;
      const readDenied = await call({ id: target.id! }, studentBearer);
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
        await sendStudent(
          'tools/call',
          { name: studentViewName, arguments: { id: target.id } },
          { headers: { authorization: `Bearer ${allToken}` } },
        ),
      );
      off();
      off = allowStudentAction('view');
      assertDenied(
        await sendStudent(
          'tools/call',
          { name: studentViewName, arguments: { id: target.id } },
          { headers: { authorization: `Bearer ${studentBearer}` } },
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
    // A missing AST in MCP must fail the AST regressions, not select the legacy branch.
    const nativeStudent = (await import('vona-module-training-student')) as Record<string, any>;
    const studentQuery = nativeStudent.studentQuery;
    const nativeQueryContract = await app.bean.executor.mockCtx(
      async () => {
        const document = JSON.parse(
          JSON.stringify(
            await app.bean.openapi.generateJsonOfControllerAction(
              nativeStudent.ControllerStudent,
              'select',
              'V31',
              { includeExcluded: true, schemaTarget: 'mcp' },
            ),
          ),
        );
        const operation = Object.values(document.paths)
          .map((item: any) => item.get)
          .find(Boolean);
        const schemas = document.components.schemas;
        const properties = Object.fromEntries(
          operation.parameters.map((parameter: any) => [parameter.name, parameter.schema]),
        ) as Record<string, any>;
        const where = resolveSchema(properties.where, schemas);
        const controls = JSON.parse(JSON.stringify(properties));
        delete controls.where;
        for (const schema of Object.values(controls) as any[]) {
          if (schema.filter?.capabilities) {
            delete schema.filter.capabilities;
            if (!Object.keys(schema.filter).length) delete schema.filter;
          }
        }
        return {
          query: where.filter?.capabilities?.query,
          controls: toolSchema(
            { type: 'object', properties: controls, required: [], additionalProperties: false },
            schemas,
          ),
          predicates: toolSchema(
            {
              anyOf: where.anyOf
                .map((branch: any) => resolveSchema(branch, schemas))
                .filter((branch: any) => branch.properties?.field && branch.properties?.op),
            },
            schemas,
          ),
        };
      },
      { instanceName: '' },
    );
    const nativeQueryCapabilities = nativeQueryContract.query;
    assert.equal(
      Boolean(studentQuery),
      Boolean(nativeQueryCapabilities),
      'native Student query export and DTO agree on public-query support',
    );
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
    let selectQuery!: Record<string, unknown>;
    let selectEmptyPageQuery!: Record<string, unknown>;
    let selectColumnsQuery!: Record<string, unknown>;
    const selectRecoveryQuery = {
      where: { field: 'name', op: 'eq', value: name },
      pageNo: 1,
      pageSize: 1,
    };
    const makeSelectQuery = (id: string | number) => ({
      name,
      level,
      where: {
        and: [
          { field: 'name', op: 'eq', value: name },
          { field: 'id', op: 'eq', value: id },
          {
            or: [
              { field: 'level', op: 'eq', value: 2 },
              { field: 'level', op: 'eq', value: 3 },
            ],
          },
        ],
      },
      orders: [{ field: 'createdAt', direction: 'desc' }],
      pageNo: 1,
      pageSize: 1,
    });
    let studentId: string | undefined;
    let imageId: string | undefined;
    let imageDirectory: string | undefined;
    let otherStudentId: string | undefined;
    let adminRoleId: string | undefined;
    let membershipOwned = false;
    const allToken = await redeemBearer('mcp:all', 'admin');
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
    const observed = mockOwnedPerformAction(
      t,
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
    const call = (id: string, token = studentBearer, legacy = false) =>
      sendStudent(
        'tools/call',
        { name: studentSummaryName, arguments: { id } },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const view = (id: string, token = studentBearer, legacy = false) =>
      sendStudent(
        'tools/call',
        { name: studentViewName, arguments: { id } },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const select = (
      token = studentBearer,
      legacy = false,
      query: Record<string, unknown> = selectQuery,
    ) =>
      sendStudent(
        'tools/call',
        { name: studentSelectName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const group = (query: Record<string, unknown>, token = studentBearer, legacy = false) =>
      sendStudent(
        'tools/call',
        { name: studentGroupName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const aggregate = (query: Record<string, unknown>, token = studentBearer, legacy = false) =>
      sendStudent(
        'tools/call',
        { name: studentAggregateName, arguments: query },
        { legacy, headers: { authorization: `Bearer ${token}` } },
      );
    const normalizeSelect = (serialized: Record<string, unknown>) => {
      const normalized = JSON.parse(JSON.stringify(serialized));
      normalized.total = String(normalized.total);
      normalized.list = normalized.list.map((row: Record<string, unknown>) => {
        row.id = String(row.id);
        if (studentActionIsScoped('select')) row.userIdOwner = String(row.userIdOwner);
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
      if (studentActionIsScoped('view')) normalized.userIdOwner = String(normalized.userIdOwner);
      // Preserve the select regression's measured optional-identity normalization.
      if (normalized.imageId === null) delete normalized.imageId;
      else if (normalized.imageId !== undefined) normalized.imageId = String(normalized.imageId);
      if (normalized.image) normalized.image.id = String(normalized.image.id);
      // DtoStudentView includes content.columns: ['descriptionMarkdown'], not its SQL id.
      if (normalized.content) delete normalized.content.id;
      for (const record of normalized.trainingRecords ?? []) {
        record.id = String(record.id);
        // PostgreSQL decimals arrive as strings before DTO number normalization.
        if (record.averageScore != null) record.averageScore = Number(record.averageScore);
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
          const student = await training.service.student.create({
            ...studentData,
            imageId,
            ...(studentActionIsScoped('select') || studentActionIsScoped('view')
              ? { departmentId: null, userIdOwner: userId }
              : {}),
          } as DtoStudentCreate);
          studentId = String(student.id);
          if (studentQuery) {
            const idField = studentQuery.fields.id;
            const publicId = idField.schema.parse(
              idField.type === 'number' ? Number(student.id) : String(student.id),
            );
            assert.ok(typeof publicId === 'string' || typeof publicId === 'number');
            selectQuery = makeSelectQuery(publicId);
          } else {
            // Legacy DTOs retain numeric convenience filters and string-form ordering.
            selectQuery = { name, level, orders: 'createdAt,desc', pageNo: 1, pageSize: 1 };
          }
          selectEmptyPageQuery = { ...selectQuery, pageNo: 2 };
          selectColumnsQuery = { ...selectQuery, columns: ['id'] };
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
      for (const { token, legacy } of [studentBearer, allToken].flatMap(token =>
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
          ...studentPolicyTerms(request.action.action),
        };
      });
      try {
        for (const { token, legacy } of [studentBearer, allToken].flatMap(token =>
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
        for (const { token, legacy } of [studentBearer, allToken].flatMap(token =>
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
      // Exercise the native unrestricted role through the ordinary membership API,
      // without mutating the shared role itself.
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
      for (const { token, legacy } of [studentBearer, allToken].flatMap(token =>
        [false, true].map(legacy => ({ token, legacy })),
      )) {
        if (studentQuery) {
          const options = { legacy, headers: { authorization: `Bearer ${token}` } };
          const listed = await sendStudent('tools/list', {}, options);
          assert.equal(listed.body.error, undefined);
          const selectTool = listed.body.result.tools.find(
            (tool: any) => tool.name === studentSelectName,
          );
          const capabilityTool = listed.body.result.tools.find(
            (tool: any) => tool.name === contractName,
          );
          assert.ok(capabilityTool, 'authorized query discovery appends the built-in lookup');
          assert.deepEqual(
            listed.body.result.tools.slice(-2).map((tool: any) => tool.name),
            [contractName, logoutName],
          );
          assert.equal(capabilityTool.outputSchema, undefined, 'schema fragments are result data');
          assert.deepEqual(capabilityTool.inputSchema.required, ['tool']);
          assert.deepEqual(Object.keys(capabilityTool.inputSchema.properties), ['tool', 'section']);
          assert.deepEqual(capabilityTool.inputSchema.properties.section.enum, [
            'overview',
            'input',
            'output',
            'query',
          ]);
          assert.equal(capabilityTool.inputSchema.properties.tool.type, 'string');
          assert.equal(capabilityTool.inputSchema.additionalProperties, false);
          const lookupCheck = fromJsonSchema(capabilityTool.inputSchema)['~standard'];
          const beforeLookup = observedCalls.length;
          for (const args of [
            {},
            { tool: 1 },
            { tool: studentSelectName, extra: true },
            { tool: studentSelectName, section: 'unsupported' },
            { tool: studentSelectName, section: 1 },
          ]) {
            assert.ok((await lookupCheck.validate(args)).issues);
            const invalid = await sendStudent(
              'tools/call',
              { name: contractName, arguments: args },
              options,
            );
            assert.equal(invalid.body.error?.code, -32602);
            assert.equal(invalid.body.result, undefined);
          }
          const capability = output(
            await sendStudent(
              'tools/call',
              { name: contractName, arguments: { tool: studentSelectName, section: 'query' } },
              options,
            ),
          );
          assert.deepEqual(Object.keys(capability).sort(), ['bindings', 'grammarVersion', 'tool']);
          assert.equal(capability.grammarVersion, 1);
          assert.equal(capability.tool, studentSelectName);
          assert.equal(capability.bindings.length, 1);
          const binding = capability.bindings[0];
          assert.deepEqual(binding.argumentPath, []);
          assert.equal(binding.mode, 'select');
          assert.deepEqual(binding.capabilities, { query: nativeQueryCapabilities });
          assert.deepEqual(binding.querySchema, nativeQueryContract.controls);
          assert.deepEqual(
            binding.predicates,
            nativeQueryContract.predicates,
            'lookup returns every exact native leaf including operand constraints, without Boolean recursion',
          );
          assert.equal(binding.querySchema.properties.where, undefined);
          const queryCapabilities = binding.capabilities.query;
          assert.deepEqual(queryCapabilities.fields.id.operators, ['eq', 'in']);
          for (const [name, mode] of [
            [studentGroupName, 'group'],
            [studentAggregateName, 'aggregate'],
          ]) {
            const analysis = output(
              await sendStudent(
                'tools/call',
                { name: contractName, arguments: { tool: name, section: 'query' } },
                options,
              ),
            );
            assert.equal(analysis.tool, name);
            assert.equal(analysis.bindings.length, 1);
            assert.deepEqual(analysis.bindings[0].argumentPath, []);
            assert.equal(analysis.bindings[0].mode, mode);
            assert.deepEqual(analysis.bindings[0].capabilities.query, nativeQueryCapabilities);
            assert.ok(analysis.bindings[0].capabilities.analysis);
            assert.equal(analysis.bindings[0].querySchema.properties.where, undefined);
            assert.deepEqual(analysis.bindings[0].predicates, binding.predicates);
          }
          const overview = output(
            await sendStudent(
              'tools/call',
              { name: contractName, arguments: { tool: studentSelectName } },
              options,
            ),
          );
          assert.deepEqual(overview, {
            contractVersion: 1,
            tool: studentSelectName,
            readOnly: true,
            sections: ['overview', 'input', 'output', 'query'],
            input: { type: 'object', compactPaths: [['where']] },
            output: { type: 'object', compactPaths: [['list', 'items']] },
          });
          const fullInput = output(
            await sendStudent(
              'tools/call',
              { name: contractName, arguments: { tool: studentSelectName, section: 'input' } },
              options,
            ),
          );
          assert.equal(fullInput.section, 'input');
          assert.equal(fullInput.contractVersion, 1);
          const fullWhere = resolveSchema(
            fullInput.schema.properties.where,
            fullInput.schema.$defs ?? {},
          );
          assert.ok(fullWhere.anyOf, 'full input retains the native recursive grammar');
          assert.deepEqual(fullWhere.filter.capabilities.query, nativeQueryCapabilities);
          assert.equal(
            (await fromJsonSchema(fullInput.schema)['~standard'].validate(selectQuery)).issues,
            undefined,
            'full input contract accepts the query used for the real HTTP Action',
          );
          const fullOutput = output(
            await sendStudent(
              'tools/call',
              { name: contractName, arguments: { tool: studentSelectName, section: 'output' } },
              options,
            ),
          );
          assert.equal(fullOutput.section, 'output');
          assert.equal(fullOutput.contractVersion, 1);
          assert.ok(
            resolveSchema(fullOutput.schema.properties.list.items, fullOutput.schema.$defs ?? {})
              .properties.mobile,
            'full output retains the serialized Student result contract',
          );
          const compactItem = selectTool.outputSchema.properties.list.items;
          assert.equal(compactItem.type, 'object');
          assert.equal(compactItem.additionalProperties, true);
          assert.equal(compactItem.properties, undefined);
          assert.match(compactItem.description, /cabloy_tool_contract/);
          assert.equal(observedCalls.length, beforeLookup, 'lookup never dispatches an Action');
          const compactWhere = selectTool.inputSchema.properties.where;
          assert.deepEqual(Object.keys(compactWhere).sort(), [
            'additionalProperties',
            'description',
            'type',
          ]);
          assert.equal(compactWhere.type, 'object');
          assert.equal(compactWhere.additionalProperties, true);
          assert.match(compactWhere.description, /cabloy_tool_contract/);
          assert.equal(
            selectTool.inputSchema.$defs,
            undefined,
            'unreachable predicates are pruned',
          );
          assert.equal(selectTool.inputSchema.properties.orders.filter?.capabilities, undefined);
          for (const [name, schema] of Object.entries(
            nativeQueryContract.controls.properties as Record<string, unknown>,
          )) {
            assert.deepEqual(
              selectTool.inputSchema.properties[name],
              schema,
              `${name} retains its native named-filter/control metadata`,
            );
          }
          for (const schema of [
            selectTool.inputSchema,
            selectTool.outputSchema,
            fullInput.schema,
            fullOutput.schema,
            binding.querySchema,
            binding.predicates,
          ]) {
            assert.equal(schema.components, undefined);
            const refs: string[] = [];
            const visit = (value: any) => {
              if (!value || typeof value !== 'object') return;
              if (typeof value.$ref === 'string') refs.push(value.$ref);
              for (const child of Object.values(value)) visit(child);
            };
            visit(schema);
            if (schema === fullOutput.schema) {
              assert.ok(refs.length, 'the full Student output still exercises references');
            }
            for (const ref of refs) {
              assert.ok(ref.startsWith('#/$defs/'), ref);
              assert.ok(resolveSchema({ $ref: ref }, schema.$defs ?? {}));
            }
          }
          assert.equal(
            selectTool.inputSchema.properties.id,
            undefined,
            'id is an advanced predicate, not a named UI convenience',
          );
          const check = fromJsonSchema(selectTool.inputSchema)['~standard'];
          assert.equal(
            (await check.validate(selectQuery)).issues,
            undefined,
            'published compact input accepts a valid near-envelope-depth query',
          );
          const predicateCheck = fromJsonSchema({
            type: 'object',
            ...binding.predicates,
          })['~standard'];
          const beforeInvalid = observedCalls.length;
          for (const query of [
            { where: { name } },
            { where: { field: 'mobile', op: 'eq', value: mobile } },
            { where: { field: 'level', op: 'eq', value: '2' } },
            { where: { field: 'level', op: 'eq', value: 4 } },
            { where: { field: 'id', op: 'in', value: [] } },
            { where: { field: 'name', op: 'eq', value: name, extra: true } },
          ]) {
            assert.equal(
              (await check.validate(query)).issues,
              undefined,
              'compact public where intentionally accepts arbitrary objects',
            );
            assert.ok((await predicateCheck.validate(query.where)).issues, JSON.stringify(query));
            const rejected = await select(token, legacy, query);
            assert.equal(rejected.status, 200);
            assert.equal(rejected.body.error?.code, -32602);
            assert.equal(rejected.body.result, undefined);
          }
          for (const query of [
            { where: [] },
            { where: 'invalid' },
            { orders: 'createdAt,desc' },
            { orders: [['createdAt', 'desc']] },
            { columns: ['id'] },
          ]) {
            assert.ok((await check.validate(query)).issues, JSON.stringify(query));
            const rejected = await select(token, legacy, query);
            assert.equal(rejected.status, 200);
            assert.equal(rejected.body.error?.code, -32602);
            assert.equal(rejected.body.result, undefined);
          }
          const semantic = await select(token, legacy, {
            where: {
              field: 'name',
              op: 'eq',
              value: 'x'.repeat(studentQuery.limits.maxStringLength + 1),
            },
          });
          assert.deepEqual(semantic.body.error, {
            code: -32602,
            message: 'Invalid tool arguments',
            data: { queryCode: 'query_string_length', path: 'where.value', hint: queryRepairHint },
          });
          assert.equal(
            observedCalls.length,
            beforeInvalid,
            'recursive/public-query failures never dispatch',
          );
          // Recover through the wire contract without dropping the original name filter.
          const rejected = await select(token, legacy, {
            where: { name },
            pageNo: 1,
            pageSize: 1,
          });
          assert.equal(rejected.status, 200);
          assert.equal(rejected.body.result, undefined);
          assert.deepEqual(rejected.body.error, {
            code: -32602,
            message: 'Invalid tool arguments',
            data: { queryCode: 'query_invalid', path: 'where', hint: queryRepairHint },
          });
          assert.match(rejected.body.error.data.hint, /cabloy_tool_contract/);
          assert.match(rejected.body.error.data.hint, /section "query"/);
          for (const privateValue of [name, mobile, descriptionMarkdown]) {
            assert.equal(JSON.stringify(rejected.body.error).includes(privateValue), false);
          }
          const recovery = output(
            await sendStudent(
              'tools/call',
              { name: contractName, arguments: { tool: studentSelectName, section: 'query' } },
              options,
            ),
          );
          assert.equal(recovery.tool, studentSelectName);
          const recoveredBinding = recovery.bindings[0];
          assert.deepEqual(recoveredBinding.argumentPath, []);
          assert.ok(recoveredBinding.capabilities.query.fields.name.operators.includes('eq'));
          assert.equal(
            (
              await fromJsonSchema({ type: 'object', ...recoveredBinding.predicates })[
                '~standard'
              ].validate(selectRecoveryQuery.where)
            ).issues,
            undefined,
          );
          assert.equal(observedCalls.length, beforeInvalid, 'error and lookup never dispatch');
          const recovered = output(await select(token, legacy, selectRecoveryQuery));
          assert.equal(recovered.total, '1');
          assert.equal(recovered.list.length, 1);
          assert.equal(String(recovered.list[0].id), studentId);
          assert.equal(recovered.list[0].name, name);
          assert.equal(
            observedCalls.length,
            beforeInvalid + 1,
            'only the corrected call dispatches',
          );
          assert.deepEqual(observedCalls.at(-1)!.options, {
            query: selectRecoveryQuery,
            innerAccess: false,
          });
        }
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
          const invalid = await sendStudent(
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
      const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
      const analysisDefaults = studentQuery
        ? {}
        : {
            orders: ormQuery?.orders?.default ?? 'createdAt,desc',
            pageNo: 1,
            pageSize: ormQuery?.pageSize?.default ?? 20,
          };
      const groupQuery = { name, level, groups: ['level'], aggrs: { count: ['*', 'imageId'] } };
      assert.deepEqual(output(await group(groupQuery)), {
        result: [{ level, count_all: '1', count_imageId: '1' }],
      });
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
      // Absent-name predicates yield no rows; the same-name foreign-instance
      // row above is already excluded from the one-row counts.
      const absentWhere = studentQuery
        ? [`MCP absent ${randomUUID()}`, `MCP absent ${randomUUID()}`].map(value => ({
            field: 'name',
            op: 'eq',
            value,
          }))
        : ['-1', otherStudentId].map(id => ({ id }));
      for (const where of absentWhere) {
        assert.deepEqual(output(await group({ where })), { result: [] });
        assert.deepEqual(output(await aggregate({ where })), {
          count_all: '0',
          count_imageId: '0',
        });
      }
      const emptyPage = output(await select(studentBearer, false, selectEmptyPageQuery));
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
      if (studentQuery) {
        const columnsRejected = await select(studentBearer, false, selectColumnsQuery);
        assert.equal(columnsRejected.body.error?.code, -32602);
        assert.equal(columnsRejected.body.result, undefined);
      } else {
        // Legacy projection is admitted, then fails at its ordinary Action boundary.
        errorResult(await select(studentBearer, false, selectColumnsQuery), 'Action failed');
      }
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
            [
              selectQuery,
              selectEmptyPageQuery,
              ...(studentQuery ? [selectRecoveryQuery] : [selectColumnsQuery]),
            ].some(query => isDeepStrictEqual(current.options, { query, innerAccess: false })),
            'select retains only the explicitly supplied native filter and pagination query',
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
          '/training/student': studentQuery ? 22 : 19,
          '/training/student/group': 16,
          '/training/student/aggregate': 16,
          '/training/student/:id': 19,
          '/training/student/summary/:id': 19,
        },
        'every student read traverses its fixed guarded action',
      );
      assert.equal(
        observedCalls.length,
        studentQuery ? 92 : 89,
        'public-query columns fail predispatch; legacy columns reach the guarded Action',
      );
      await app.bean.executor.mockCtx(
        async () => {
          assert.equal(await app.bean.role.removeUserId(adminRoleId!, userId), true);
          membershipOwned = false;
        },
        { instanceName: '' },
      );
      for (const { token, legacy } of [studentBearer, allToken].flatMap(token =>
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
        studentQuery ? 112 : 109,
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

  it('accepts Inspector registration metadata and ignores unknown authority hints', async () => {
    const response = await openHttp({
      target: '/mcp/register',
      body: JSON.stringify({
        redirect_uris: ['http://127.0.0.1:6274/oauth/callback'],
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code'],
        response_types: ['code'],
        client_name: 'MCP Inspector',
        client_uri: 'https://github.com/modelcontextprotocol/inspector',
        scope: 'mcp:read',
        application_type: 'native',
        resource: 'https://other.example.test/mcp',
        instanceName: 'shareTest',
        vendor_options: { features: ['example'] },
      }),
    }).response;
    const clientId = response.body.client_id as string | undefined;
    try {
      assert.equal(response.status, 201);
      assert.ok(clientId);
      assert.equal(response.headers['cache-control'], 'no-store');
      assert.equal(response.body.client_name, 'MCP Inspector');
      assert.deepEqual(response.body.redirect_uris, ['http://127.0.0.1:6274/oauth/callback']);
      assert.equal(response.body.scope, 'mcp:read');
      assert.equal(response.body.token_endpoint_auth_method, 'none');
      assert.deepEqual(response.body.grant_types, ['authorization_code']);
      assert.deepEqual(response.body.response_types, ['code']);
      for (const key of [
        'client_uri',
        'application_type',
        'resource',
        'instanceName',
        'vendor_options',
        'client_secret',
      ]) {
        assert.equal(Object.hasOwn(response.body, key), false, key);
      }
      await app.bean.executor.mockCtx(async () => {
        const client = await app.scope('mcp-auth').service.registration.resolve(clientId, resource);
        assert.ok(client);
        assert.deepEqual(client.resources, [resource]);
        assert.equal(client.scope, 'mcp:read');
      });
    } finally {
      if (clientId) {
        await app.bean.executor.mockCtx(() =>
          app
            .scope('mcp-auth')
            .model.client.builderSelect()
            .where({ oauthClientId: clientId })
            .delete(),
        );
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
        body: JSON.stringify({
          ...JSON.parse(validBody),
          client_uri: 'https://client.example.test/about',
          scope: 'offline_access',
        }),
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
    assert.equal(metadata.body.issuer, getMcpIssuer(app));
    assert.equal(metadata.body.authorization_endpoint, `${getMcpIssuer(app)}/auth`);
    assert.equal(metadata.body.token_endpoint, `${getMcpIssuer(app)}/token`);
    assert.equal(metadata.body.registration_endpoint, `${getMcpIssuer(app)}/register`);
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
              resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
            ),
          { instanceName: '' },
        );
        clients.push(registration.client_id);
        assert.deepEqual(registration.grant_types, ['authorization_code', 'refresh_token']);
      }
      const [owner, wrongClient] = clients;
      const token = await redeemTokens('mcp:read', owner, undefined, 'admin');
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
            resource: studentResource,
          }).toString(),
        }).response;
      const read = (accessToken: string) =>
        sendStudent(
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

  it('logs out only the current read OAuth grant, rejecting strict arguments without revocation', async () => {
    let oauthClientId: string | undefined;
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
    try {
      const registration = await app.bean.executor.mockCtx(
        async () =>
          app.scope('mcp-auth').service.registration.register(
            {
              client_name: 'Managed MCP read logout',
              redirect_uris: [redirectUri],
              token_endpoint_auth_method: 'none',
              grant_types: ['authorization_code', 'refresh_token'],
              response_types: ['code'],
              scope: 'mcp:read',
            },
            resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
          ),
        { instanceName: '' },
      );
      oauthClientId = registration.client_id;
      const token = await redeemTokens('mcp:read', oauthClientId);
      const independent = await redeemTokens('mcp:read', oauthClientId);
      assert.ok(token.refresh_token);
      assert.ok(independent.refresh_token);
      const listed = await send('tools/list', {}, options(token.access_token));
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      const logout = listed.body.result.tools.find((tool: any) => tool.name === logoutName);
      assert.ok(logout, 'read scope includes the destructive authorization builtin');
      assert.deepEqual(logout.inputSchema, {
        type: 'object',
        properties: {},
        additionalProperties: false,
      });
      assert.equal(logout.annotations.readOnlyHint, false);
      assert.equal(logout.annotations.destructiveHint, true);
      assert.equal(logout.annotations.openWorldHint, false);
      if (!trainingDisabled) {
        const denied = await send(
          'tools/call',
          { name: studentCreateName, arguments: {} },
          options(token.access_token),
        );
        assert.deepEqual(denied.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(denied.body.result, undefined, 'logout does not widen read scope');
      }
      for (const args of [{ unexpected: true }, null, [], 'logout', 1]) {
        const rejected = await send(
          'tools/call',
          { name: logoutName, arguments: args },
          options(token.access_token),
        );
        assert.equal(rejected.status, 200);
        assert.deepEqual(rejected.body.error, { code: -32602, message: 'Invalid params' });
        assert.equal(rejected.body.result, undefined);
        const stillActive = await send('tools/list', {}, options(token.access_token));
        assert.equal(stillActive.status, 200, 'invalid arguments must not revoke authorization');
        assert.equal(stillActive.body.error, undefined);
      }
      assert.deepEqual(
        output(await send('tools/call', { name: logoutName }, options(token.access_token))),
        logoutResult,
        'omitted arguments are accepted',
      );
      // Each send opens another HTTP connection using the same authorization.
      for (const method of ['tools/list', 'tools/call']) {
        const denied = await send(
          method,
          method === 'tools/call' ? { name: logoutName, arguments: {} } : {},
          options(token.access_token),
        );
        assert.equal(denied.status, 401);
        assert.match(String(denied.headers['www-authenticate']), /error="invalid_token"/);
      }
      const rejectedRefresh = await refresh(token.refresh_token);
      assert.equal(rejectedRefresh.status, 400);
      assert.equal(rejectedRefresh.body.error, 'invalid_grant');
      assert.equal(rejectedRefresh.headers['cache-control'], 'no-store');
      const survivor = await send('tools/list', {}, options(independent.access_token));
      assert.equal(survivor.status, 200, 'another grant for the same user and client survives');
      assert.equal(survivor.body.error, undefined);
      const renewed = await refresh(independent.refresh_token);
      assert.equal(renewed.status, 200, 'the independent refresh family also survives');
      assert.equal(renewed.body.scope, 'mcp:read');
      assert.equal((await send('tools/list', {}, options(renewed.body.access_token))).status, 200);
    } finally {
      await app.bean.executor.mockCtx(
        async () => {
          if (oauthClientId) {
            await app.scope('mcp-auth').model.authorization.delete({ oauthClientId });
            await app.scope('mcp-auth').model.client.delete({ oauthClientId });
          }
        },
        { instanceName: '' },
      );
    }
  });

  it('retains logout outside a custom OAuth selection even when no business Action remains visible', async t => {
    if (trainingDisabled) return;
    let scopeId: string | undefined;
    let oauthClientId: string | undefined;
    let off: (() => void) | undefined = allowStudentAction('select');
    const dispatched = mockOwnedPerformAction(t, async () => {
      assert.fail('custom logout and excluded tools must not dispatch business Actions');
    });
    const personal = (action: string, method = 'GET', body?: object) =>
      openHttp({
        target: `${app.util.combineApiPath(`/mcp/auth/customScope/${action}`, '', true, true)}?ssrSiteId=admin`,
        method,
        headers: { authorization: `Bearer ${browserToken}`, origin },
        body: body === undefined ? undefined : JSON.stringify(body),
      }).response;
    const options = (token: string) => ({ headers: { authorization: `Bearer ${token}` } });
    try {
      const catalog = await personal('catalog');
      assert.equal(catalog.status, 200);
      const tools = catalog.body.data as IMcpToolCatalogItem[];
      assert.equal(
        tools.some(tool => tool.name === logoutName),
        false,
        'not a consentable Action',
      );
      const selected = tools.find(tool => tool.name === studentSelectName);
      assert.ok(selected);
      const created = await personal('createMine', 'POST', {
        name: `MCP-logout-${randomUUID()}`,
        description: 'One business read with independent authorization logout',
        tools: [{ name: selected.name, controller: selected.controller, action: selected.action }],
      });
      assert.equal(created.status, 200);
      assert.ok(created.body.data.id);
      scopeId = String(created.body.data.id);
      const scope = created.body.data.scope as TypeMcpScope;
      const registration = await app.bean.executor.mockCtx(
        async () =>
          app.scope('mcp-auth').service.registration.register(
            {
              client_name: 'Managed MCP custom logout',
              redirect_uris: [redirectUri],
              token_endpoint_auth_method: 'none',
              grant_types: ['authorization_code', 'refresh_token'],
              response_types: ['code'],
              scope: 'mcp:all',
            },
            resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
          ),
        { instanceName: '' },
      );
      oauthClientId = registration.client_id;
      const token = await redeemTokens('mcp:all', oauthClientId, scope, 'admin');
      assert.ok(token.refresh_token);
      const listed = await sendStudent('tools/list', {}, options(token.access_token));
      assert.equal(listed.status, 200);
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name),
        [studentSelectName, contractName, logoutName],
      );
      const excluded = await sendStudent(
        'tools/call',
        { name: studentGroupName, arguments: {} },
        options(token.access_token),
      );
      assert.deepEqual(excluded.body.error, { code: -32602, message: 'Invalid params' });
      assert.equal(
        excluded.body.result,
        undefined,
        'builtin does not grant sibling business tools',
      );
      off();
      off = undefined;
      const noActions = await sendStudent('tools/list', {}, options(token.access_token));
      assert.equal(noActions.status, 200);
      assert.deepEqual(
        noActions.body.result.tools.map((tool: any) => tool.name),
        [logoutName],
      );
      assert.deepEqual(
        output(
          await sendStudent(
            'tools/call',
            { name: logoutName, arguments: {} },
            options(token.access_token),
          ),
        ),
        logoutResult,
        'empty arguments work without any visible business Action',
      );
      const denied = await sendStudent('tools/list', {}, options(token.access_token));
      assert.equal(denied.status, 401);
      assert.match(String(denied.headers['www-authenticate']), /error="invalid_token"/);
      const refresh = await openHttp({
        target: '/mcp/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: oauthClientId,
          refresh_token: token.refresh_token,
          resource: studentResource,
        }).toString(),
      }).response;
      assert.equal(refresh.status, 400);
      assert.equal(refresh.body.error, 'invalid_grant');
      assert.equal(refresh.headers['cache-control'], 'no-store');
      assert.equal(dispatched.mock.callCount(), 0);
    } finally {
      off?.();
      dispatched.mock.restore();
      await app.bean.executor.mockCtx(
        async () => {
          if (oauthClientId) {
            await app.scope('mcp-auth').model.authorization.delete({ oauthClientId });
          }
          if (scopeId) await app.scope('mcp-auth').model.customScope.deleteById(scopeId);
          if (oauthClientId) await app.scope('mcp-auth').model.client.delete({ oauthClientId });
        },
        { instanceName: '' },
      );
    }
  });

  it('logs out a personal access token without revoking a separate token for the same user', async () => {
    const ids: string[] = [];
    const tokens: string[] = [];
    const options = (token: string) => ({ headers: { authorization: `Bearer ${token}` } });
    try {
      for (const label of ['logout', 'survivor']) {
        const created = await openHttp({
          target: `${app.util.combineApiPath('/mcp/auth/accessToken/createMine', '', true, true)}?ssrSiteId=web`,
          headers: { authorization: `Bearer ${browserToken}`, origin },
          body: JSON.stringify({ name: `MCP ${label} ${randomUUID()}`, scope: 'mcp:read' }),
        }).response;
        assert.equal(created.status, 200);
        assert.ok(created.body.data.id);
        ids.push(String(created.body.data.id));
        assert.equal(typeof created.body.data.accessToken, 'string');
        tokens.push(created.body.data.accessToken);
      }
      const [token, independent] = tokens;
      const listed = await send('tools/list', {}, options(token));
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      assert.ok(listed.body.result.tools.some((tool: any) => tool.name === logoutName));
      assert.deepEqual(
        output(await send('tools/call', { name: logoutName, arguments: {} }, options(token))),
        logoutResult,
      );
      const denied = await send('tools/list', {}, options(token));
      assert.equal(denied.status, 401);
      assert.match(String(denied.headers['www-authenticate']), /error="invalid_token"/);
      await app.bean.executor.mockCtx(
        async () => {
          const row = await app.scope('mcp-auth').model.authorization.getById(ids[0]);
          assert.ok(row);
          assert.equal(row.state, 'revoked', 'Passport signout revokes the personal authorization');
        },
        { instanceName: '' },
      );
      const survivor = await send('tools/list', {}, options(independent));
      assert.equal(survivor.status, 200);
      assert.equal(survivor.body.error, undefined);
    } finally {
      await app.bean.executor.mockCtx(
        async () => {
          for (const id of ids.toReversed()) {
            await app.scope('mcp-auth').model.authorization.deleteById(id);
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
      { target: '/mcp/web?instanceName=shareTest' },
      { target: `/mcp/web?${encodeURIComponent(queryField)}=shareTest` },
      { headers: { [headerField]: 'shareTest' } },
      { target: '/mcp/web?instanceName=', headers: { [headerField]: 'shareTest' } },
      { target: '/mcp/web?instanceName=unconfigured' },
    ])
      assert.equal((await send('tools/list', {}, options)).status, 403);
    assert.equal(mcpTransportSnapshot(app)?.contexts ?? 0, contexts);
    for (const target of ['/mcp/web', '/mcp/web?instanceName=']) {
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
      // The existing request context supplies the fallback; nonloopback HTTP is forbidden.
      [{ headers: { host: `unregistered.example.test:${port}` } }, 503],
      [{ headers: { forwarded: 'for=192.0.2.1' } }, 403],
      [{ headers: { cookie: 'token=forbidden' } }, 403],
      [{ headers: { 'proxy-authorization': 'Bearer forbidden' } }, 403],
      [{ headers: { authorization: 'synthetic-forbidden' } }, 401],
      [{ headers: { authorization: ['Bearer first', 'Bearer second'] } }, 401],
      [{ target: '/mcp/web?instanceName=shareTest&instanceName=' }, 400],
      [{ target: '/mcp/web?access_token=forbidden' }, 400],
      [{ target: '/mcp/web?unexpected=1' }, 400],
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
      const legacySigned = await redeemBearer('mcp:read', 'admin');
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
      for (const token of [studentBearer, opaque]) {
        assert.deepEqual(
          output(
            await sendStudent(
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
      target: '/.well-known/oauth-protected-resource/mcp/web',
    }).response;
    assert.equal(metadata.status, 200);
    assert.deepEqual(metadata.body, {
      resource,
      authorization_servers: [getMcpIssuer(app)],
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
      `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp/web"`,
    );
    const held = mockOwnedPerformAction(t, async () => {
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
          { resource, instanceName: '', ssrSiteId: 'web' },
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
      assert.equal((await sendStudent('tools/list')).status, 503);
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
    const pending = sendStudent('tools/call', {
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
        (await openHttp({ headers: { authorization: `Bearer ${studentBearer}` } }).response).status,
        503,
        'closing denies new work while old work drains',
      );
      resume();
      await closure;
      assert.equal(workFinished, true);
      assert.equal((await pending).status, 503);
      assert.equal(mcpTransportSnapshot(app)?.active, 0);
      assert.equal(mcpTransportSnapshot(app)?.closing, true);
      assert.equal((await sendStudent('tools/list')).status, 503);
      assert.ok(app.server?.listening);
      const metadata = await openHttp({
        method: 'GET',
        target: '/.well-known/oauth-protected-resource/mcp/web',
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
