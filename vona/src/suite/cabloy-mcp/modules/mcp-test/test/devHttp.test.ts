import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';

import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { request } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import { fixtureIngressLimits } from 'vona-module-cabloy-mcp';
import { getMcpIssuer } from 'vona-module-mcp-auth';

import { closeDevTransport, devTransportSnapshot } from '../src/lib/mcpTransport.ts';
import { ServiceCatalog } from '../src/service/catalog.ts';

const version = '2026-07-28';
const categoriesName = 'commerce_categories_list';
const searchName = 'commerce_products_search';
const detailName = 'commerce_product_detail';
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

async function redeemBearer() {
  const verifier = randomBytes(32).toString('base64url');
  const requestId = await app.bean.executor.mockCtx(
    async () => {
      return await app.scope('mcp-auth').service.authorization.authorize(
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
  assert.equal(token.body.scope, 'mcp:read');
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
        client_name: 'Managed MCP dynamic test',
        redirect_uris: [redirectUri],
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code'],
        response_types: ['code'],
      }),
    }).response;
    assert.equal(registration.status, 201);
    assert.equal(registration.body.token_endpoint_auth_method, 'none');
    assert.deepEqual(registration.body.redirect_uris, [redirectUri]);
    assert.equal(registration.body.scope, 'mcp:read');
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

  it('shares discovery, modern/legacy three-tool flows and ordinary catalog routes on one listener', async () => {
    const server = app.server;
    const discovered = await send('server/discover');
    assert.equal(discovered.status, 200);
    assert.deepEqual(discovered.body.result.supportedVersions, [version]);
    for (const legacy of [false, true]) {
      if (legacy) {
        const initialized = await send(
          'initialize',
          {
            protocolVersion: '2025-11-25',
            capabilities: {},
            clientInfo: { name: 'dev-http-test', version: '1' },
          },
          { legacy },
        );
        assert.equal(initialized.status, 200);
        assert.equal(initialized.body.result.protocolVersion, '2025-11-25');
      }
      const listed = await send('tools/list', {}, { legacy });
      assert.equal(listed.status, 200);
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name),
        [searchName, detailName, categoriesName],
      );
      const call = async (name: string, args: Record<string, unknown>) =>
        output(await send('tools/call', { name, arguments: args }, { legacy }));
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
    await assertError(
      {
        target: '/mcp/register',
        body: JSON.stringify({ ...JSON.parse(validBody), resource }),
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
    assert.equal(metadata.headers['cache-control'], 'no-store');
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
      scopes_supported: ['mcp:read'],
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
