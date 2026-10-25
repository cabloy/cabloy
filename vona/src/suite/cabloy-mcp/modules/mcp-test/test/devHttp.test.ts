import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';

import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { request } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import { BeanExecutor } from 'vona-module-a-executor';
import { fixtureIngressLimits } from 'vona-module-cabloy-mcp';
import { getMcpIssuer } from 'vona-module-mcp-auth';

import { toolFixtureState } from '../src/controller/toolFixture.ts';
import { closeDevTransport, devTransportSnapshot } from '../src/lib/mcpTransport.ts';
import { ServiceCatalog } from '../src/service/catalog.ts';

const version = '2026-07-28';
const categoriesName = 'commerce_categories_list';
const searchName = 'commerce_products_search';
const detailName = 'commerce_product_detail';
const studentSummaryName = 'training_student_summary';
const statusName = 'mcp_test_action_status';
const effectName = 'mcp_test_action_effect';
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
      const timer = setTimeout(() => req.destroy(new Error('Dev MCP HTTP timeout')), 15000);
      req.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      req.once('response', res => {
        const chunks: Buffer[] = [];
        let size = 0;
        res.on('data', (chunk: Buffer) => {
          size += chunk.length;
          if (size > 1024 * 1024) res.destroy(new Error('Dev MCP response limit'));
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
    assert.ok(Date.now() < deadline, 'dev exchange actually settled');
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
  if (response.status !== 429) await waitFor(() => !devTransportSnapshot(app)?.active);
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

// The root managed test runner owns this listener and disposable instance state.
// No test creates another application/listener or changes global origin configuration.
describe('devHttp.test.ts', { concurrency: false, timeout: 60000 }, () => {
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
        const user = await app.bean.user.register({ name: `mcp-dev-http-${randomUUID()}` }, true);
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

  it('shares discovery, modern/legacy catalog flows and ordinary catalog routes on one listener', async () => {
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
            clientInfo: { name: 'dev-http-test', version: '1' },
          },
          { legacy, headers },
        );
        assert.equal(initialized.status, 200);
        assert.equal(initialized.body.result.protocolVersion, '2025-11-25');
      }
      const listed = await send('tools/list', {}, { legacy, headers });
      assert.equal(listed.status, 200);
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name).sort(),
        [
          searchName,
          detailName,
          categoriesName,
          statusName,
          'mcp_test_action_scalar',
          'mcp_test_action_array',
          ...(token === allToken ? [effectName] : []),
          ...(app.meta.modules['training-student'] ? [studentSummaryName] : []),
        ].sort(),
      );
      if (app.meta.modules['training-student']) {
        const studentTool = listed.body.result.tools.find(
          (tool: any) => tool.name === studentSummaryName,
        );
        assert.ok(studentTool);
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
          assert.equal(JSON.stringify(studentTool.inputSchema).includes(`"${field}"`), false);
          assert.equal(JSON.stringify(studentTool.outputSchema).includes(`"${field}"`), false);
        }
      }
      const call = async (name: string, args: Record<string, unknown>) =>
        output(await send('tools/call', { name, arguments: args }, { legacy, headers }));
      const categories = await call(categoriesName, {});
      const electronics = categories.list.find((item: any) => item.name === 'Electronics');
      assert.ok(electronics);
      const search = await call(searchName, {
        categoryId: electronics.id,
        title: 'Wireless Headphones',
      });
      assert.equal(search.list.length, 1);
      const detail = await call(detailName, { id: search.list[0].id });
      assert.equal(detail.id, search.list[0].id);
      assert.equal(detail.categoryId, electronics.id);
      assert.equal(detail.priceCents, 9999);
      assert.equal(detail.available, 11);
    }
    const ordinary = await openHttp({
      method: 'GET',
      target: `${app.config.server.globalPrefix}/mcp/test/catalog/categories`,
    }).response;
    assert.equal(ordinary.status, 200);
    assert.ok(
      JSON.stringify(ordinary.body).includes('Electronics'),
      'ordinary router remains active',
    );
    assert.equal(app.server, server);
    assert.ok(app.server?.listening, 'per-request cleanup does not close shared server');
  });

  it('filters write discovery and rejects read-scope calls before dispatch across modern and legacy transports', async t => {
    const initial = toolFixtureState.count;
    const allToken = await redeemBearer('mcp:all');
    const original = BeanExecutor.prototype.performAction;
    const calls: Array<{
      method: unknown;
      path: unknown;
      options: unknown;
      userId: string;
      authId: string;
    }> = [];
    const observed = t.mock.method(
      BeanExecutor.prototype,
      'performAction',
      async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
        calls.push({
          method: args[0],
          path: args[1],
          options: args[2],
          userId: String(this.bean.passport.currentUser?.id),
          authId: String(this.bean.passport.currentAuth?.id),
        });
        return await original.apply(this, args);
      },
    );
    try {
      for (const legacy of [false, true]) {
        const invoke = (token: string, name: string, args: Record<string, unknown> = {}) =>
          send(
            'tools/call',
            { name, arguments: args },
            {
              legacy,
              headers: { authorization: `Bearer ${token}` },
            },
          );
        const args = { params: { label: 'http-scope-proof' }, body: { amount: 1 } };
        const beforeDenied = toolFixtureState.count;
        const beforeDispatch = calls.length;
        const denied = await invoke(bearer, effectName, args);
        assert.equal(denied.status, 200);
        assert.equal(denied.body.error?.code, -32602);
        assert.equal(denied.body.result, undefined);
        assert.equal(calls.length, beforeDispatch, 'scope is checked before performAction');
        assert.equal(toolFixtureState.count, beforeDenied);
        const closed = await invoke(allToken, 'mcp-test_toolFixture_closed');
        assert.equal(closed.body.error?.code, -32602);
        assert.equal(calls.length, beforeDispatch, 'an unannotated sibling is not dispatchable');
        // Public fixture proves scope and Passport handoff, not RBAC; student tests below do that.
        const accepted = output(await invoke(allToken, effectName, args));
        assert.deepEqual(accepted, { count: beforeDenied + 1, label: 'http-scope-proof' });
        const dispatched = calls.at(-1)!;
        assert.deepEqual(dispatched, {
          method: 'post',
          path: '/mcp/test/actions/effect/:label',
          options: { ...args, innerAccess: false },
          userId: fixtureUserId,
          authId: fixtureAuthId,
        });
        assert.deepEqual(output(await invoke(bearer, statusName)), { count: beforeDenied + 1 });
        assert.equal(calls.at(-1)!.method, 'get');
        assert.equal(calls.at(-1)!.path, '/mcp/test/actions/status');
        assert.deepEqual(calls.at(-1)!.options, { innerAccess: false });
      }
    } finally {
      toolFixtureState.count = initial;
      observed.mock.restore();
    }
  });

  it('guards persisted student summaries with current roles across modern/legacy read scopes and instance boundaries', async t => {
    if (!app.meta.modules['training-student']) {
      t.skip('training-student is not active');
      return;
    }
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
            name: `Other-instance student ${randomUUID()}`,
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
      // Neither OAuth read scope grants ordinary users student-view authority.
      for (const token of [bearer, allToken]) {
        errorResult(await call(studentId, token), 'Action failed');
        assert.equal(observedCalls.at(-1)!.roleNames.includes('systemAdmin'), false);
      }
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
        const response = await call(studentId, token, legacy);
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
        assert.equal(current.path, '/training/student/summary/:id');
        const options = current.options as { params: { id: string }; innerAccess: boolean };
        assert.deepEqual(options, { params: { id: options.params.id }, innerAccess: false });
        assert.equal(current.userId, userId);
        assert.equal(current.authId, fixtureAuthId);
      }
      assert.equal(observedCalls.length, 8, 'every read traverses the fixed guarded action');
      await app.bean.executor.mockCtx(
        async () => {
          assert.equal(await app.bean.role.removeUserId(adminRoleId!, userId), true);
          membershipOwned = false;
        },
        { instanceName: '' },
      );
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
    const params = { name: categoriesName, arguments: {} };
    const contexts = devTransportSnapshot(app)?.contexts ?? 0;
    const queryField = app.config.instance.queryField!;
    const headerField = app.config.instance.headerField!;
    for (const options of [
      { target: '/mcp?instanceName=shareTest' },
      { target: `/mcp?${encodeURIComponent(queryField)}=shareTest` },
      { headers: { [headerField]: 'shareTest' } },
      { target: '/mcp?instanceName=', headers: { [headerField]: 'shareTest' } },
      { target: '/mcp?instanceName=unconfigured' },
    ])
      assert.equal((await send('tools/call', params, options)).status, 403);
    assert.equal(devTransportSnapshot(app)?.contexts ?? 0, contexts);
    for (const target of ['/mcp', '/mcp?instanceName=']) {
      assert.ok(output(await send('tools/call', params, { target })).list.length > 0);
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
      await waitFor(() => devTransportSnapshot(app)?.active === 1);
      assert.equal((await send('tools/list')).status, 429);
    } finally {
      pending.req.destroy();
      await waitFor(() => !devTransportSnapshot(app)?.active);
    }
    assert.equal((await send('tools/list')).status, 200);
    assert.ok(app.server?.listening);
  });

  it('installs current server-owned Passport into guarded business actions without forwarding bearer credentials', async t => {
    const original = ServiceCatalog.prototype.selectPublic;
    const observed = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
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
      output(await send('tools/call', { name: searchName, arguments: {} }));
      assert.equal(observed.mock.callCount(), 1);
    } finally {
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
    const held = t.mock.method(ServiceCatalog.prototype, 'selectPublic', async () => {
      throw new Error('unauthorized business dispatch');
    });
    try {
      for (const token of ['a'.repeat(43), browserToken]) {
        const denied = await send(
          'tools/call',
          { name: searchName, arguments: {} },
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
              { name: searchName, arguments: {} },
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
        { name: searchName, arguments: {} },
        { headers: { authorization: `Bearer ${insufficient}` } },
      );
      assert.equal(forbidden.status, 403);
      assert.match(String(forbidden.headers['www-authenticate']), /error="insufficient_scope"/);
      assert.equal(held.mock.callCount(), 0);
      const config = app.config.modules['mcp-auth'];
      const contexts = devTransportSnapshot(app)?.contexts;
      try {
        app.config.modules['mcp-auth'] = { ...config, tokenTtl: 0 };
        assert.equal((await send('tools/list')).status, 503);
        assert.equal(devTransportSnapshot(app)?.contexts, contexts);
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

  it('drains actual app-owned tool work without closing the shared listener', async t => {
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let entered = false;
    let workFinished = false;
    const original = ServiceCatalog.prototype.selectPublic;
    const held = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
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
      name: searchName,
      arguments: { title: 'Wireless Headphones' },
    });
    try {
      await waitFor(() => entered);
      let closed = false;
      const closure = closeDevTransport(app).then(() => {
        closed = true;
      });
      await delay(25);
      assert.equal(closed, false, 'transport cancellation is not actual work settlement');
      assert.equal(workFinished, false);
      assert.equal(devTransportSnapshot(app)?.active, 1);
      resume();
      await closure;
      assert.equal(workFinished, true);
      assert.equal((await pending).status, 503);
      assert.equal(devTransportSnapshot(app)?.active, 0);
      assert.equal(devTransportSnapshot(app)?.closing, true);
      assert.equal((await send('tools/list')).status, 503);
      assert.ok(app.server?.listening);
      assert.equal(
        (
          await openHttp({
            method: 'GET',
            target: `${app.config.server.globalPrefix}/mcp/test/catalog/categories`,
          }).response
        ).status,
        200,
      );
    } finally {
      resume();
      try {
        await closeDevTransport(app);
        await pending;
      } finally {
        held.mock.restore();
      }
    }
  });
});
