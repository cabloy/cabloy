import type { TableIdentity } from 'table-identity';
import type { VonaApplication } from 'vona';
import type { BeanSsrSiteBase } from 'vona-module-a-ssr';
import type {
  IMcpTokenPayload,
  IMcpAuthConfig,
  IMcpAuthResource,
  TypeMcpClientAuthentication,
  TypeMcpGrantTypes,
} from 'vona-module-mcp-auth';

import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { before, describe, it } from 'node:test';
import { setTimeout } from 'node:timers/promises';
import { AppUtil } from 'vona';
import { acquireTestLock, app } from 'vona-mock';
import {
  MiddlewareSystemAuthorization,
  config as defaultConfig,
  getMcpAuthConfig,
  getMcpIssuer,
  OAuthError,
  resolveMcpResource,
  resolveMcpInstance,
  sha256,
  validateMcpAuthConfig,
  ServiceAuthorization,
} from 'vona-module-mcp-auth';

let resource: IMcpAuthResource;
const verifier = 'v'.repeat(43);
const challenge = createHash('sha256').update(verifier).digest('base64url');
const callback = 'https://client.example.test/callback?existing=1';
const password = 'mcp-authorization-test-password';

interface Fixture {
  config: IMcpAuthConfig;
  clientId: string;
  clientSecret?: string;
  userId: TableIdentity;
  name: string;
  roleIds: TableIdentity[];
}

function service() {
  return app.scope('mcp-auth').service.authorization;
}
function model() {
  return app.scope('mcp-auth').model.authorization;
}
function authorizationParams(clientId: string) {
  return new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callback,
    resource: resource.resource,
    scope: 'mcp:read',
    state: 'client-state',
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
}
function tokenParams(clientId: string, code: string) {
  return new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: callback,
    resource: resource.resource,
    code_verifier: verifier,
  });
}
function refreshParams(clientId: string, refreshToken: string, scope?: string) {
  return new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
    resource: resource.resource,
    ...(scope === undefined ? {} : { scope }),
  });
}
async function accessPayload(token: string): Promise<IMcpTokenPayload> {
  const payload = await app.bean.jwt.get('mcpAccess').verify(token);
  assert.ok(payload, 'MCP access signature must verify');
  return payload as IMcpTokenPayload;
}
async function expectOAuth(operation: () => Promise<unknown>, code: string, status?: number) {
  await assert.rejects(
    operation,
    error =>
      error instanceof OAuthError &&
      error.oauthError === code &&
      (status === undefined || error.status === status),
  );
}
async function asUser<T>(fixture: Fixture, operation: () => Promise<T>): Promise<T> {
  return await app.bean.executor.mockCtx(async () => {
    await app.bean.auth.authenticate('auth-simple:simple', {
      clientOptions: { username: fixture.name, password },
      state: { intention: 'login' },
    });
    try {
      return await operation();
    } finally {
      await app.bean.passport.signout();
    }
  });
}
async function withFixture(
  operation: (fixture: Fixture) => Promise<void>,
  authentication: TypeMcpClientAuthentication = 'none',
  registrationScope?: string,
  grantTypes: TypeMcpGrantTypes = ['authorization_code'],
) {
  // Same lock as the RS tests: both temporarily own the global registration fixture.
  const release = await acquireTestLock('test-mcp');
  const original = structuredClone(app.config.modules['mcp-auth']);
  const name = `mcp-auth-${randomUUID()}`;
  let clientId: string | undefined;
  let clientSecret: string | undefined;
  let userId: TableIdentity | undefined;
  let authId: TableIdentity | undefined;
  let profileId: TableIdentity | undefined;
  const roleIds: TableIdentity[] = [];
  const config: IMcpAuthConfig = {
    registration: { ...defaultConfig().registration! },
    pendingTtl: 600,
    codeTtl: 60,
    tokenTtl: 2 * 60 * 60,
    refreshTokenTtl: 604800,
    personalTokenTtl: 604800,
    allowLoopbackHttp: true,
  };
  try {
    Object.assign(app.config.modules['mcp-auth'], config);
    await app.bean.executor.mockCtx(async () => {
      const registered = await app.scope('mcp-auth').service.registration.register(
        {
          client_name: 'Test client',
          redirect_uris: [callback],
          token_endpoint_auth_method: authentication,
          grant_types: grantTypes,
          response_types: ['code'],
          ...(registrationScope === undefined ? {} : { scope: registrationScope }),
        },
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
      );
      clientId = registered.client_id;
      clientSecret = registered.client_secret;
      const user = await app.bean.user.register({ name }, true);
      userId = user.id;
      const profile = await app
        .scope('auth-simple')
        .service.authSimple.createForUser(user.id, password);
      profileId = profile!.id;
      const auth = await app.scope('a-auth').model.auth.get({ userId });
      authId = auth!.id;
    });
    await operation({ config, clientId: clientId!, clientSecret, userId: userId!, name, roleIds });
  } finally {
    try {
      await app.bean.executor.mockCtx(async () => {
        if (clientId !== undefined) {
          await model().builderSelect().where({ oauthClientId: clientId }).delete();
          await app.scope('mcp-auth').model.client.delete({ oauthClientId: clientId });
        }
        if (authId !== undefined) await app.scope('a-auth').model.auth.deleteById(authId);
        if (profileId !== undefined)
          await app.scope('auth-simple').model.authSimple.deleteById(profileId);
        if (userId !== undefined) {
          await app.scope('home-user').model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
        for (const roleId of roleIds.toReversed()) {
          await app.scope('home-user').model.role.deleteById(roleId);
        }
      });
    } finally {
      Object.assign(app.config.modules['mcp-auth'], original);
      release();
    }
  }
}
async function ownRole(fixture: Fixture, mcpAccess = false) {
  return await app.bean.executor.mockCtx(async () => {
    const role = await app.scope('home-user').model.role.insert({
      name: `mcp-admission-${randomUUID()}`,
      title: 'MCP admission regression',
      siteIds: ['web'],
      builtin: false,
      mcpAccess,
    });
    fixture.roleIds.push(role.id);
    return role.id;
  });
}
async function issueCode(fixture: Fixture, scope = 'mcp:read') {
  const params = authorizationParams(fixture.clientId);
  params.set('scope', scope);
  const request = await app.bean.executor.mockCtx(() => service().authorize(params, resource));
  const decision = await asUser(fixture, () => service().decide(request, true));
  const code = new URL(decision.redirectUrl).searchParams.get('code')!;
  return { request, code };
}
async function redeem(fixture: Fixture, code: string) {
  return await app.bean.executor.mockCtx(() =>
    service().exchange(tokenParams(fixture.clientId, code), undefined),
  );
}
async function refresh(fixture: Fixture, token: string, scope?: string) {
  return await app.bean.executor.mockCtx(() =>
    service().exchange(refreshParams(fixture.clientId, token, scope), undefined),
  );
}

describe('authorization.test.ts', { concurrency: false }, () => {
  before(() => {
    const issuer = getMcpIssuer(app);
    resource = resolveMcpResource(app, new URL(issuer).host, 'web');
  });

  it('validates policy defaults and derives issuer and exact host authority from the backend', async () => {
    const config = defaultConfig();
    assert.deepEqual(validateMcpAuthConfig(config), {
      registration: {
        maxBodyBytes: 16384,
        maxRedirectUris: 16,
        rateLimit: 10,
        rateLimitWindow: 600,
      },
      pendingTtl: 600,
      codeTtl: 60,
      tokenTtl: 2 * 60 * 60,
      refreshTokenTtl: 604800,
      personalTokenTtl: 604800,
      allowLoopbackHttp: true,
    });
    assert.equal(validateMcpAuthConfig(config), config);
    for (const patch of [
      { tokenTtl: 0 },
      { refreshTokenTtl: 0 },
      { refreshTokenTtl: 1.5 },
      { refreshTokenTtl: 2592001 },
      { pendingTtl: 86401 },
      { codeTtl: 1.5 },
      { registration: { ...config.registration!, maxRedirectUris: 0 } },
      { registration: { ...config.registration!, maxBodyBytes: 1023 } },
      { registration: { ...config.registration!, rateLimit: 0 } },
      { registration: { ...config.registration!, rateLimitWindow: 0 } },
    ]) {
      assert.throws(() => validateMcpAuthConfig({ ...config, ...patch }), OAuthError);
    }
    assert.equal(
      validateMcpAuthConfig({ ...config, allowLoopbackHttp: false }).allowLoopbackHttp,
      false,
    );

    const origin = app.util.getAbsoluteUrl();
    assert.equal(getMcpIssuer(app), `${origin}/mcp`);
    assert.equal(resource.resource, `${getMcpIssuer(app)}/web`);
    const url = new URL(resource.resource);
    const automatic = app.createAnonymousContext({
      headers: { host: url.host },
      method: 'POST',
      url: '/mcp',
      socket: { encrypted: url.protocol === 'https:' },
    });
    assert.equal(resource.instanceName, automatic.instanceName);
    assert.deepEqual(resolveMcpResource(app, url.host, 'web'), resource);
    for (const wrongHost of [
      'attacker.example.test',
      `${url.host}.attacker.example.test`,
      `${url.host},attacker.example.test`,
      `${url.host}/mcp`,
      url.port ? url.hostname : `${url.hostname}:12345`,
    ]) {
      assert.throws(
        () => resolveMcpResource(app, wrongHost, 'web'),
        error => error instanceof OAuthError && error.oauthError === 'invalid_target',
      );
    }
    await app.bean.executor.mockCtx(
      async () => {
        assert.ok(app.currentContext);
        assert.notEqual(app.currentContext.instanceName, resource.instanceName);
        assert.deepEqual(resolveMcpResource(app, url.host, 'web'), resource);
      },
      { instanceName: 'shareTest' as any },
    );
  });

  it('shares request-origin fallback while retaining MCP origin validation', async () => {
    const ctx = app.createAnonymousContext({
      headers: { host: '127.0.0.1:7102' },
      method: 'POST',
      url: '/mcp',
      socket: { encrypted: false },
    });
    await app.ctxStorage.run(ctx, () => {
      assert.equal(getMcpIssuer(app), `${app.util.getAbsoluteUrl()}/mcp`);
      assert.equal(getMcpIssuer(app), 'http://127.0.0.1:7102/mcp');
    });
    for (const [protocol, host] of [
      ['http', 'mcp.example.test'],
      ['https', 'MCP.example.test'],
      ['https', 'mcp.example.test/path'],
      ['https', 'user@mcp.example.test'],
      ['https', 'mcp.example.test?query=1'],
      ['https', 'mcp.example.test#fragment'],
    ]) {
      const application = {
        meta: { isProd: true },
        config: {
          server: { serve: { protocol, host } },
          modules: { 'mcp-auth': { ...defaultConfig(), allowLoopbackHttp: false } },
        },
      } as unknown as VonaApplication;
      const util = new AppUtil();
      Object.defineProperty(util, 'app', { value: application });
      Object.defineProperty(application, 'util', { value: util });
      assert.throws(() => getMcpIssuer(application), OAuthError);
    }
  });

  it('routes consent to the exact requested enabled site, without shortest-path fallback', async () => {
    await withFixture(async fixture => {
      const sites = await app.bean.executor.mockCtx(async () =>
        app.scope('a-ssr').service.ssr.getSitesEnabled(),
      );
      assert.ok(sites.length > 1);
      for (const ssrSiteId of ['web', 'admin', 'commerce', 'commerceAdmin', 'missing', '']) {
        const expected = sites.find(site => site.beanOptions.options?.siteId === ssrSiteId);
        const url = new URL(resource.resource);
        const params = authorizationParams(fixture.clientId);
        params.set('resource', `${getMcpIssuer(app)}/${ssrSiteId}`);
        await app.bean.executor.mockCtx(
          async () => {
            const ctx = app.currentContext!;
            const middleware = app.bean._getBean(MiddlewareSystemAuthorization);
            const execute = () =>
              middleware.execute({}, async () => {
                assert.fail('authorization must not fall through');
              });
            if (!expected) {
              await execute();
              assert.equal(ctx.status, 400);
              assert.deepEqual(ctx.body, { error: 'invalid_target' });
              return;
            }
            const site = app.bean._getBean<BeanSsrSiteBase>(
              expected.beanOptions.beanFullName as any,
            );
            await assert.rejects(execute, error => {
              assert.ok(error instanceof Error);
              assert.equal(error.code, 302);
              const redirect = new URL(error.message, url.origin);
              assert.equal(redirect.pathname, site.getPagePath('/cabloy/mcp/consent' as any));
              assert.ok(redirect.searchParams.get('request'));
              return true;
            });
          },
          {
            instanceName: resource.instanceName as any,
            req: {
              headers: { host: url.host },
              rawHeaders: ['Host', url.host],
              method: 'GET',
              url: `/mcp/auth?${params}`,
              socket: { encrypted: url.protocol === 'https:' },
            },
          },
        );
      }
    });
  });

  it('returns the resource-owned absolute scopes URL for each enabled Site', async () => {
    await withFixture(async fixture => {
      for (const [ssrSiteId, publicPath] of [
        ['web', ''],
        ['admin', '/admin'],
        ['commerce', '/commerce'],
        ['commerceAdmin', '/commerce-admin'],
      ]) {
        const target = await app.bean.executor.mockCtx(async () =>
          resolveMcpResource(app, new URL(resource.resource).host, ssrSiteId),
        );
        const request = await app.bean.executor.mockCtx(async () => {
          const params = authorizationParams(fixture.clientId);
          params.set('resource', target.resource);
          return await service().authorize(params, target);
        });
        await asUser(fixture, async () => {
          const summary = await service().summary(request);
          assert.equal(summary.resource, target.resource);
          assert.equal(summary.ssrSiteId, ssrSiteId);
          assert.equal(
            summary.scopesUrl,
            `${new URL(target.resource).origin}${publicPath}/cabloy/mcp/scopes`,
          );
        });
      }
    });
  });

  it('uses existing real login and one-row digests through approval, exchange and revocation', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.clientId;
      const request = await app.bean.executor.mockCtx(async () => {
        assert.deepEqual(getMcpAuthConfig(app), fixture.config);
        return await service().authorize(authorizationParams(clientId), resource);
      });
      await app.bean.executor.mockCtx(() =>
        expectOAuth(() => service().summary(request), 'access_denied'),
      );
      await app.bean.executor.mockCtx(() =>
        expectOAuth(() => service().decide(request, true), 'access_denied'),
      );
      await app.bean.executor.mockCtx(async () => {
        const client = await app.scope('mcp-auth').model.client.get({ oauthClientId: clientId });
        assert.ok(client);
        assert.equal(client.scope, 'mcp:all');
        const pending = await model().get({ requestDigest: sha256(request) });
        assert.ok(pending);
        assert.equal(String(pending.clientId), String(client.id));
        assert.equal(pending.oauthClientId, clientId);
        assert.equal(pending.scope, 'mcp:read');
      });
      const decision = await asUser(fixture, async () => {
        const summary = await service().summary(request);
        assert.equal(summary.clientName, 'Test client');
        assert.equal(summary.resource, resource.resource);
        assert.equal(summary.scope, 'mcp:read');
        assert.ok(summary.expiresAt > Date.now());
        return await service().decide(request, true);
      });
      const redirect = new URL(decision.redirectUrl);
      assert.equal(redirect.origin, new URL(callback).origin);
      assert.equal(redirect.searchParams.get('existing'), '1');
      assert.equal(redirect.searchParams.get('state'), 'client-state');
      const code = redirect.searchParams.get('code')!;
      await app.bean.executor.mockCtx(async () => {
        assert.equal((await model().get({ codeDigest: sha256(code) }))?.scope, 'mcp:read');
      });
      const token = await redeem(fixture, code);
      assert.equal(token.token_type, 'Bearer');
      assert.equal(token.expires_in, 7200);
      assert.equal(token.scope, 'mcp:read');
      assert.equal('refresh_token' in token, false);
      await app.bean.executor.mockCtx(async () => {
        const rows = await model().builderSelect().where({ oauthClientId: clientId });
        assert.equal(rows.length, 1);
        assert.equal(rows[0].requestDigest, sha256(request));
        assert.equal(rows[0].scope, 'mcp:read');
        assert.equal(rows[0].codeDigest, '');
        const payload = await accessPayload(token.access_token);
        const decodedAccess = app.bean.jwt.get('mcpAccess').instance.decode(token.access_token) as {
          exp: number;
          iat: number;
        };
        assert.equal(decodedAccess.exp - decodedAccess.iat, 7200);
        assert.equal(app.bean.jwt.get('mcpAccess').getExpiresIn(), 7200);
        assert.equal(rows[0].tokenVersion, 1);
        assert.equal(Boolean(rows[0].refreshEnabled), false);
        assert.equal(Number(rows[0].refreshExpiresAt), 0);
        assert.equal(rows[0].tokenDigest, sha256(payload.token));
        assert.ok(rows[0].tokenDigest !== sha256(token.access_token));
        assert.ok(!JSON.stringify(rows).includes(token.access_token));
        assert.ok(!JSON.stringify(rows).includes(payload.token));
        await expectOAuth(
          () => service().exchange(refreshParams(clientId, token.access_token), undefined),
          'unauthorized_client',
        );
        const passport = await service().lookup(token.access_token, resource.resource);
        assert.equal(String(passport.user!.id), String(fixture.userId));
        assert.ok(passport.auth);
        assert.ok(passport.roles?.some(role => role.name === 'registeredUser'));
        const context = await service().lookupContext(token.access_token, resource.resource);
        assert.equal(context.scope, 'mcp:read');
        assert.deepEqual(context.passport, passport);
        await app.bean.role.replaceUserRoleIds(fixture.userId, []);
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
          401,
        );
        await expectOAuth(
          () => service().lookupContext(token.access_token, resource.resource),
          'invalid_token',
          401,
        );
        await expectOAuth(
          () => service().exchange(tokenParams(clientId, code), undefined),
          'invalid_grant',
        );
        await service().revoke(token.access_token);
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
        await expectOAuth(
          () => service().lookupContext(token.access_token, resource.resource),
          'invalid_token',
        );
      });
    });
  });

  it('requires a current direct role grant for consent, uses any-role OR and still permits denial', async () => {
    await withFixture(async fixture => {
      const ordinaryRoleId = await ownRole(fixture);
      const grantRoleId = await ownRole(fixture, true);
      await app.bean.executor.mockCtx(() =>
        app.bean.role.replaceUserRoleIds(fixture.userId, [ordinaryRoleId]),
      );
      const request = await app.bean.executor.mockCtx(() =>
        service().authorize(authorizationParams(fixture.clientId), resource),
      );
      await asUser(fixture, async () => {
        assert.equal(await app.bean.passport.isSystemAdmin(), false);
        await expectOAuth(() => service().summary(request), 'access_denied', 403);
        await expectOAuth(() => service().decide(request, true), 'access_denied', 403);
        const row = await model().get({ requestDigest: sha256(request) });
        assert.equal(row?.state, 'pending');
        assert.equal(row?.codeDigest, '');
        await app.bean.role.addUserId(grantRoleId, fixture.userId);
        assert.equal((await service().summary(request)).scope, 'mcp:read');
        // The browser Passport still has only its original false role; admission reloads membership.
        assert.equal(
          app.bean.passport.currentRoles?.some(role => role.mcpAccess),
          false,
        );
        await app.bean.role.removeUserId(grantRoleId, fixture.userId);
        await expectOAuth(() => service().decide(request, true), 'access_denied', 403);
        const denied = await service().decide(request, false);
        assert.equal(new URL(denied.redirectUrl).searchParams.get('error'), 'access_denied');
        assert.equal((await model().get({ requestDigest: sha256(request) }))?.state, 'denied');
      });
      // A stale admin browser identity must not bypass the fresh direct-role check either.
      await app.bean.executor.mockCtx(async () => {
        const admin = await app.scope('home-user').model.role.getByName('systemAdmin');
        assert.ok(admin);
        assert.equal(admin.mcpAccess, true);
        await app.bean.role.addUserId(admin.id, fixture.userId);
      });
      const next = await app.bean.executor.mockCtx(() =>
        service().authorize(authorizationParams(fixture.clientId), resource),
      );
      await asUser(fixture, async () => {
        assert.equal(await app.bean.passport.isSystemAdmin(), true);
        await app.bean.role.replaceUserRoleIds(fixture.userId, []);
        await expectOAuth(() => service().summary(next), 'access_denied', 403);
        await expectOAuth(() => service().decide(next, true), 'access_denied', 403);
      });
    });
  });

  it('rechecks code exchange and suspends existing OAuth access and refresh until a role flag is restored', async () => {
    await withFixture(
      async fixture => {
        const roleId = await ownRole(fixture, true);
        await app.bean.executor.mockCtx(() =>
          app.bean.role.replaceUserRoleIds(fixture.userId, [roleId]),
        );
        const { request, code } = await issueCode(fixture);
        await app.bean.executor.mockCtx(() =>
          app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false }),
        );
        await expectOAuth(() => redeem(fixture, code), 'invalid_grant', 400);
        await app.bean.executor.mockCtx(async () => {
          const row = await model().get({ requestDigest: sha256(request) });
          assert.equal(row?.state, 'codeReady');
          assert.equal(row?.codeDigest, sha256(code));
          assert.equal(row?.tokenDigest, '');
          await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: true });
        });
        const token = await redeem(fixture, code);
        assert.ok(token.refresh_token);
        const before = await app.bean.executor.mockCtx(async () => {
          await service().lookup(token.access_token, resource.resource);
          const row = await model().get({ requestDigest: sha256(request) });
          assert.ok(row);
          await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false });
          return row;
        });
        await app.bean.executor.mockCtx(() =>
          expectOAuth(
            () => service().lookupContext(token.access_token, resource.resource),
            'invalid_token',
            401,
          ),
        );
        await expectOAuth(() => refresh(fixture, token.refresh_token!), 'invalid_grant', 400);
        await app.bean.executor.mockCtx(async () => {
          assert.deepEqual(
            await model().getById(before.id),
            before,
            'denial must not delete or revoke the grant',
          );
          await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: true });
        });
        await app.bean.executor.mockCtx(async () => {
          const passport = await service().lookup(token.access_token, resource.resource);
          assert.equal(String(passport.user?.id), String(fixture.userId));
        });
        const restored = await refresh(fixture, token.refresh_token);
        assert.ok(restored.refresh_token);
        await app.bean.executor.mockCtx(async () => {
          await service().lookup(restored.access_token, resource.resource);
          await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false });
        });
        await app.bean.executor.mockCtx(async () => {
          await service().revoke(restored.access_token);
          assert.equal((await model().getById(before.id))?.state, 'revoked');
        });
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('rejects tampered internal client references and cannot rebind a grant to a recreated external identifier', async () => {
    await withFixture(
      async fixture => {
        const other = await app.bean.executor.mockCtx(() =>
          app
            .scope('mcp-auth')
            .service.registration.register(
              { client_name: 'Other internal client', redirect_uris: [callback] },
              resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
            ),
        );
        try {
          const request = await app.bean.executor.mockCtx(async () => {
            const client = await app
              .scope('mcp-auth')
              .model.client.get({ oauthClientId: fixture.clientId });
            const otherClient = await app
              .scope('mcp-auth')
              .model.client.get({ oauthClientId: other.client_id });
            assert.ok(client && otherClient);
            const request = await service().authorize(
              authorizationParams(fixture.clientId),
              resource,
            );
            const row = await model().get({ requestDigest: sha256(request) });
            assert.ok(row);
            assert.equal(String(row.clientId), String(client.id));
            assert.equal(row.oauthClientId, fixture.clientId);
            await model().updateById(row.id, { clientId: otherClient.id });
            return { request, row, client, otherClient };
          });
          await asUser(fixture, async () => {
            await expectOAuth(() => service().summary(request.request), 'invalid_grant');
            await expectOAuth(() => service().decide(request.request, true), 'invalid_grant');
          });
          await app.bean.executor.mockCtx(() =>
            model().updateById(request.row.id, { clientId: request.client.id }),
          );
          const decision = await asUser(fixture, () => service().decide(request.request, true));
          const code = new URL(decision.redirectUrl).searchParams.get('code')!;
          await app.bean.executor.mockCtx(() =>
            model().updateById(request.row.id, { clientId: request.otherClient.id }),
          );
          await expectOAuth(() => redeem(fixture, code), 'invalid_grant');
          await app.bean.executor.mockCtx(() =>
            model().updateById(request.row.id, { clientId: request.client.id }),
          );
          const token = await redeem(fixture, code);
          assert.ok(token.refresh_token);
          for (const binding of [
            { clientId: request.otherClient.id, oauthClientId: fixture.clientId },
            { clientId: request.client.id, oauthClientId: other.client_id },
          ]) {
            await app.bean.executor.mockCtx(async () => {
              await model().updateById(request.row.id, binding);
              await expectOAuth(
                () => service().lookup(token.access_token, resource.resource),
                'invalid_token',
              );
            });
            await expectOAuth(() => refresh(fixture, token.refresh_token!), 'invalid_grant');
          }
          await app.bean.executor.mockCtx(async () => {
            await model().updateById(request.row.id, {
              clientId: request.client.id,
              oauthClientId: fixture.clientId,
            });
            await service().lookup(token.access_token, resource.resource);
            await app.scope('mcp-auth').model.client.deleteById(request.client.id, {
              disableDeleted: true,
            });
            const recreated = await app.scope('mcp-auth').model.client.insert({
              ...request.client,
              id: undefined,
            });
            assert.notEqual(String(recreated.id), String(request.client.id));
            const resolved = await app
              .scope('mcp-auth')
              .service.registration.resolve(fixture.clientId, resource.resource);
            assert.equal(String(resolved?.id), String(recreated.id));
            await expectOAuth(
              () => service().lookup(token.access_token, resource.resource),
              'invalid_token',
            );
          });
          await expectOAuth(() => refresh(fixture, token.refresh_token!), 'invalid_grant');
        } finally {
          await app.bean.executor.mockCtx(async () => {
            // A failed assertion may leave this owned grant's external snapshot tampered.
            await model().delete({ oauthClientId: other.client_id }, { disableDeleted: true });
            await app
              .scope('mcp-auth')
              .model.client.delete({ oauthClientId: other.client_id }, { disableDeleted: true });
          });
        }
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('rotates signed refresh grants and revokes the whole family on older refresh replay', async t => {
    await withFixture(
      async fixture => {
        const evidence: Array<{ event: string; family: string; generation: number }> = [];
        // Install only after the fixture owns test-mcp; restore before it releases that lock.
        const logger = t.mock.getter(ServiceAuthorization.prototype as any, '$logger', () => ({
          debug(event: string, message: (typeof evidence)[number]) {
            assert.equal(event, message.event);
            evidence.push(message);
            if (message.generation === 3) throw new Error('synthetic diagnostic failure');
          },
        }));
        try {
          const { request, code } = await issueCode(fixture, 'mcp:all');
          const initial = await redeem(fixture, code);
          assert.ok(
            initial.refresh_token,
            'Explicit refresh registration must issue a refresh token',
          );
          assert.equal(evidence.length, 0, 'Initial issuance is not refresh evidence');
          const initialPayload = await app.bean.executor.mockCtx(() =>
            accessPayload(initial.access_token),
          );
          await setTimeout(1);
          const first = await refresh(fixture, initial.refresh_token);
          assert.ok(first.refresh_token);
          assert.ok(first.access_token !== initial.access_token);
          assert.ok(first.refresh_token !== initial.refresh_token);
          const latest = await refresh(fixture, first.refresh_token, 'mcp:read');
          assert.ok(latest.refresh_token);
          assert.equal(evidence.length, 2);
          assert.match(evidence[0].family, /^[a-f0-9]{64}$/);
          const family = evidence[0].family;
          assert.deepEqual(evidence, [
            { event: 'mcp.oauth.refresh_succeeded', family, generation: 2 },
            { event: 'mcp.oauth.refresh_succeeded', family, generation: 3 },
          ]);
          const serialized = JSON.stringify(evidence);
          for (const secret of [
            request,
            code,
            fixture.clientId,
            initial.access_token,
            initial.refresh_token,
            first.access_token,
            first.refresh_token,
            latest.access_token,
            latest.refresh_token,
            callback,
            password,
          ]) {
            assert.equal(serialized.includes(secret), false);
          }
          await app.bean.executor.mockCtx(async () => {
            const payload = await accessPayload(latest.access_token);
            const row = await model().get({ requestDigest: sha256(request) });
            assert.ok(row);
            assert.equal(row.state, 'tokenActive');
            assert.equal(row.tokenVersion, 1);
            assert.equal(row.refreshEnabled, true);
            assert.equal(row.refreshGeneration, 3);
            assert.equal(row.tokenDigest, sha256(payload.token));
            assert.equal(payload.mcp.generation, 3);
            assert.ok(payload.mcp.refreshExpiresAt > initialPayload.mcp.refreshExpiresAt);
            assert.equal(payload.mcp.grantId, String(row.id));
            assert.equal(payload.mcp.scope, 'mcp:read');
            assert.equal(
              String((await service().lookup(latest.access_token, resource.resource)).user!.id),
              String(fixture.userId),
            );
            for (const previous of [initial.access_token, first.access_token]) {
              await expectOAuth(
                () => service().lookup(previous, resource.resource),
                'invalid_token',
              );
            }
          });
          // Generation 1 remains detectable even after another rotation and a scope narrowing.
          await expectOAuth(() => refresh(fixture, initial.refresh_token!), 'invalid_grant');
          await app.bean.executor.mockCtx(async () => {
            const row = await model().get({ requestDigest: sha256(request) });
            assert.equal(row?.state, 'revoked');
            assert.equal(row?.tokenDigest, '');
            assert.equal(row?.refreshGeneration, 3);
            await expectOAuth(
              () => service().lookup(latest.access_token, resource.resource),
              'invalid_token',
            );
          });
          await expectOAuth(() => refresh(fixture, latest.refresh_token!), 'invalid_grant');
          assert.equal(evidence.length, 2, 'Rejected refresh must not report success');
        } finally {
          logger.mock.restore();
        }
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('rejects wrong clients and token purposes without rotating or revoking a valid family', async () => {
    await withFixture(
      async fixture => {
        const { request, code } = await issueCode(fixture);
        const token = await redeem(fixture, code);
        assert.ok(token.refresh_token);
        const other = await app.bean.executor.mockCtx(() =>
          app.scope('mcp-auth').service.registration.register(
            {
              client_name: 'Other refresh client',
              redirect_uris: [callback],
              grant_types: ['authorization_code', 'refresh_token'],
            },
            resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
          ),
        );
        try {
          await app.bean.executor.mockCtx(async () => {
            const before = await model().get({ requestDigest: sha256(request) });
            const payload = await accessPayload(token.access_token);
            const ordinaryAccess = await app.bean.jwt.get('access').sign(payload);
            const ordinaryRefresh = await app.bean.jwt.get('refresh').sign(payload);
            for (const candidate of [token.refresh_token!, ordinaryAccess, ordinaryRefresh]) {
              await expectOAuth(
                () => service().lookup(candidate, resource.resource),
                'invalid_token',
              );
            }
            for (const candidate of [token.access_token, ordinaryAccess, ordinaryRefresh]) {
              await expectOAuth(
                () => service().exchange(refreshParams(fixture.clientId, candidate), undefined),
                'invalid_grant',
              );
            }
            await expectOAuth(
              () =>
                service().exchange(refreshParams(other.client_id, token.refresh_token!), undefined),
              'invalid_grant',
            );
            for (let index = 0; index < 2; index++) {
              assert.equal(
                (await service().lookupContext(token.access_token, resource.resource)).scope,
                'mcp:read',
              );
            }
            const after = await model().get({ requestDigest: sha256(request) });
            assert.equal(after?.state, 'tokenActive');
            assert.equal(after?.tokenDigest, before?.tokenDigest);
            assert.equal(after?.refreshGeneration, before?.refreshGeneration);
            assert.equal(after?.refreshExpiresAt, before?.refreshExpiresAt);
            assert.equal(after?.tokenExpiresAt, before?.tokenExpiresAt);
            assert.equal(after?.expiresAt, before?.expiresAt);
          });
          const rotated = await refresh(fixture, token.refresh_token);
          assert.ok(rotated.refresh_token);
          await app.bean.executor.mockCtx(async () => {
            assert.equal(
              (await model().get({ requestDigest: sha256(request) }))?.refreshGeneration,
              2,
            );
          });
          // Even a genuine historical refresh token cannot revoke another client's family.
          await app.bean.executor.mockCtx(async () => {
            await expectOAuth(
              () =>
                service().exchange(refreshParams(other.client_id, token.refresh_token!), undefined),
              'invalid_grant',
            );
            assert.equal(
              (await model().get({ requestDigest: sha256(request) }))?.state,
              'tokenActive',
            );
            await service().lookup(rotated.access_token, resource.resource);
          });
        } finally {
          await app.bean.executor.mockCtx(() =>
            app.scope('mcp-auth').model.client.delete({ oauthClientId: other.client_id }),
          );
        }
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('refreshes after access expiry while cleanup retains the live refresh family', async () => {
    await withFixture(
      async fixture => {
        const { request, code } = await issueCode(fixture);
        const initial = await redeem(fixture, code);
        assert.ok(initial.refresh_token);
        await app.bean.executor.mockCtx(async () => {
          const payload = await accessPayload(initial.access_token);
          const expiredAccess = await app.bean.jwt
            .get('mcpAccess')
            .sign(payload, { expiresIn: -1 });
          const row = await model().get({ requestDigest: sha256(request) });
          assert.ok(row);
          await model().updateById(row.id, { tokenExpiresAt: Date.now() - 1 });
          await expectOAuth(
            () => service().lookup(expiredAccess, resource.resource),
            'invalid_token',
          );
          await expectOAuth(
            () => service().lookup(initial.access_token, resource.resource),
            'invalid_token',
          );
          await service().cleanupExpired();
          assert.equal((await model().get({ id: row.id }))?.state, 'tokenActive');
        });
        const rotated = await refresh(fixture, initial.refresh_token);
        assert.equal(rotated.scope, 'mcp:read');
        assert.ok(rotated.refresh_token);
        await app.bean.executor.mockCtx(async () => {
          const row = await model().get({ requestDigest: sha256(request) });
          assert.equal(row?.refreshGeneration, 2);
          assert.ok(Number(row?.tokenExpiresAt) > Date.now());
          await service().lookup(rotated.access_token, resource.resource);
        });
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('renews the refresh deadline and cleans up only after access and renewed family expiry', async () => {
    await withFixture(
      async fixture => {
        const { request, code } = await issueCode(fixture);
        const initial = await redeem(fixture, code);
        assert.ok(initial.refresh_token);
        // Give only this owned family a near-expiry deadline, without changing the global clock.
        const originalDeadline = Date.now() + 3000;
        const nearExpiryRefresh = await app.bean.executor.mockCtx(async () => {
          const payload = await accessPayload(initial.access_token);
          payload.mcp.refreshExpiresAt = originalDeadline;
          const row = await model().get({ requestDigest: sha256(request) });
          assert.ok(row);
          await model().updateById(row.id, {
            refreshExpiresAt: originalDeadline,
            expiresAt: Math.max(Number(row.tokenExpiresAt), originalDeadline),
          });
          return await app.bean.jwt.get('mcpRefresh').sign(payload, { expiresIn: 3 });
        });
        const beforeRefresh = Date.now();
        const first = await refresh(fixture, nearExpiryRefresh);
        const afterRefresh = Date.now();
        assert.equal(first.expires_in, 7200);
        assert.ok(first.refresh_token);
        const firstPayload = await app.bean.executor.mockCtx(async () => {
          const payload = await accessPayload(first.access_token);
          const ttl = fixture.config.refreshTokenTtl! * 1000;
          assert.ok(payload.mcp.refreshExpiresAt >= beforeRefresh + ttl);
          assert.ok(payload.mcp.refreshExpiresAt <= afterRefresh + ttl);
          assert.ok(payload.mcp.refreshExpiresAt > originalDeadline);
          return payload;
        });
        await setTimeout(Math.max(0, originalDeadline - Date.now() + 1));
        await app.bean.executor.mockCtx(async () => {
          const row = await model().get({ requestDigest: sha256(request) });
          assert.ok(row);
          await model().updateById(row.id, {
            tokenExpiresAt: Date.now() - 1,
            expiresAt: Number(row.refreshExpiresAt),
          });
          await service().cleanupExpired();
          assert.equal((await model().get({ id: row.id }))?.state, 'tokenActive');
        });
        const latest = await refresh(fixture, first.refresh_token);
        assert.equal(latest.expires_in, 7200);
        assert.ok(latest.refresh_token);
        await app.bean.executor.mockCtx(async () => {
          const payload = await accessPayload(latest.access_token);
          const refreshPayload = await app.bean.jwt.get('mcpRefresh').verify(latest.refresh_token);
          assert.ok(refreshPayload);
          assert.ok(payload.mcp.refreshExpiresAt > firstPayload.mcp.refreshExpiresAt);
          const decodedRefresh = app.bean.jwt
            .get('mcpRefresh')
            .instance.decode(latest.refresh_token!) as {
            exp: number;
          };
          assert.ok(decodedRefresh.exp * 1000 <= payload.mcp.refreshExpiresAt);
          assert.ok(payload.mcp.refreshExpiresAt - decodedRefresh.exp * 1000 < 2000);
          assert.equal(
            (refreshPayload as IMcpTokenPayload).mcp.refreshExpiresAt,
            payload.mcp.refreshExpiresAt,
          );
          const row = await model().get({ requestDigest: sha256(request) });
          assert.ok(row);
          assert.equal(Number(row.refreshExpiresAt), payload.mcp.refreshExpiresAt);
          assert.equal(
            Number(row.expiresAt),
            Math.max(Number(row.tokenExpiresAt), Number(row.refreshExpiresAt)),
          );
          // Advance only this family's persisted deadline, keeping a valid signed access token.
          const expiredDeadline = Date.now() - 1;
          payload.mcp.refreshExpiresAt = expiredDeadline;
          await model().updateById(row.id, {
            refreshExpiresAt: expiredDeadline,
            expiresAt: Number(row.tokenExpiresAt),
          });
          const access = await app.bean.jwt.get('mcpAccess').sign(payload, { expiresIn: 900 });
          const expiredFamilyRefresh = await app.bean.jwt
            .get('mcpRefresh')
            .sign(payload, { expiresIn: 900 });
          await expectOAuth(
            () =>
              service().exchange(refreshParams(fixture.clientId, expiredFamilyRefresh), undefined),
            'invalid_grant',
          );
          await service().lookup(access, resource.resource);
          await service().cleanupExpired();
          assert.equal((await model().get({ id: row.id }))?.state, 'tokenActive');
          await model().updateById(row.id, {
            tokenExpiresAt: expiredDeadline,
            expiresAt: expiredDeadline,
          });
          await service().cleanupExpired();
          assert.equal(await model().get({ id: row.id }), undefined);
          await expectOAuth(() => service().lookup(access, resource.resource), 'invalid_token');
        });
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('allows refresh scope narrowing but never expands the current family authority', async () => {
    await withFixture(
      async fixture => {
        const { request, code } = await issueCode(fixture, 'mcp:all');
        const initial = await redeem(fixture, code);
        assert.ok(initial.refresh_token);
        const narrowed = await refresh(fixture, initial.refresh_token, 'mcp:read');
        assert.equal(narrowed.scope, 'mcp:read');
        assert.ok(narrowed.refresh_token);
        for (const scope of ['mcp:all', 'mcp:all mcp:read', 'mcp:write', '']) {
          await expectOAuth(
            () => refresh(fixture, narrowed.refresh_token!, scope),
            'invalid_scope',
          );
        }
        await app.bean.executor.mockCtx(async () => {
          const row = await model().get({ requestDigest: sha256(request) });
          assert.equal(row?.scope, 'mcp:read');
          assert.equal(row?.refreshGeneration, 2);
          assert.equal(row?.state, 'tokenActive');
          assert.equal(
            (await service().lookupContext(narrowed.access_token, resource.resource)).scope,
            'mcp:read',
          );
        });
        const inherited = await refresh(fixture, narrowed.refresh_token);
        assert.equal(inherited.scope, 'mcp:read');
        assert.ok(inherited.refresh_token);
        await app.bean.executor.mockCtx(async () => {
          assert.equal((await accessPayload(inherited.access_token)).mcp.scope, 'mcp:read');
          assert.equal(
            (await model().get({ requestDigest: sha256(request) }))?.refreshGeneration,
            3,
          );
        });
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('commits concurrent refresh replay revocation across separate contexts', async () => {
    await withFixture(
      async fixture => {
        const { request, code } = await issueCode(fixture);
        const initial = await redeem(fixture, code);
        assert.ok(initial.refresh_token);
        const results = await Promise.allSettled([
          refresh(fixture, initial.refresh_token),
          refresh(fixture, initial.refresh_token),
        ]);
        const winners = results.filter(result => result.status === 'fulfilled');
        const losers = results.filter(result => result.status === 'rejected');
        assert.equal(winners.length, 1);
        assert.equal(losers.length, 1);
        assert.ok(
          losers[0].reason instanceof OAuthError && losers[0].reason.oauthError === 'invalid_grant',
        );
        const winner = winners[0].value;
        assert.ok(winner.refresh_token);
        // Inspect a fresh context after both competing autocommit operations have settled.
        await app.bean.executor.mockCtx(async () => {
          const row = await model().get({ requestDigest: sha256(request) });
          assert.equal(row?.state, 'revoked');
          assert.equal(row?.tokenDigest, '');
          assert.equal(row?.refreshGeneration, 2);
          await expectOAuth(
            () => service().lookup(initial.access_token, resource.resource),
            'invalid_token',
          );
          await expectOAuth(
            () => service().lookup(winner.access_token, resource.resource),
            'invalid_token',
          );
        });
        await expectOAuth(() => refresh(fixture, winner.refresh_token!), 'invalid_grant');
      },
      'none',
      undefined,
      ['authorization_code', 'refresh_token'],
    );
  });

  it('preserves legacy opaque-token scope/expiry checks and suspends admission without blocking revocation', async () => {
    await withFixture(async fixture => {
      const roleId = await ownRole(fixture, true);
      await app.bean.executor.mockCtx(() =>
        app.bean.role.replaceUserRoleIds(fixture.userId, [roleId]),
      );
      const { request } = await issueCode(fixture);
      const opaque = randomBytes(32).toString('base64url');
      await app.bean.executor.mockCtx(async () => {
        const row = await model().get({ requestDigest: sha256(request) });
        assert.ok(row);
        const deadline = Date.now() + 900000;
        await model().updateById(row.id, {
          state: 'tokenActive',
          codeDigest: '',
          tokenDigest: sha256(opaque),
          tokenVersion: 0,
          tokenExpiresAt: deadline,
          expiresAt: deadline,
          refreshEnabled: false,
          refreshGeneration: 0,
          refreshExpiresAt: 0,
        });
        assert.equal((await service().lookupContext(opaque, resource.resource)).scope, 'mcp:read');
        assert.equal(
          String((await service().lookup(opaque, resource.resource)).user!.id),
          String(fixture.userId),
        );
        for (const scope of ['', 'mcp:write', 'mcp:all mcp:read', 'mcp:read mcp:all']) {
          await model().updateById(row.id, { scope });
          await assert.rejects(
            () => service().lookup(opaque, resource.resource),
            error =>
              error instanceof OAuthError &&
              error.oauthError === 'insufficient_scope' &&
              error.status === 403,
          );
        }
        await model().updateById(row.id, { scope: 'mcp:read', tokenVersion: 1 });
        await expectOAuth(() => service().lookup(opaque, resource.resource), 'invalid_token');
        await model().updateById(row.id, { tokenVersion: 0, tokenExpiresAt: Date.now() - 1 });
        await expectOAuth(() => service().lookup(opaque, resource.resource), 'invalid_token');
        await model().updateById(row.id, { tokenExpiresAt: deadline });
        await service().lookup(opaque, resource.resource);
        assert.equal(app.ctx.state.passportAuthTokenClient, 'mcpAccess');
        await app.bean.passport.signout();
        assert.equal(app.bean.passport.current, undefined);
        assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
        assert.equal((await model().get({ id: row.id }))?.state, 'revoked');
        await model().updateById(row.id, { state: 'tokenActive', tokenDigest: sha256(opaque) });
        await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false });
        await expectOAuth(() => service().lookup(opaque, resource.resource), 'invalid_token', 401);
        assert.equal((await model().getById(row.id))?.state, 'tokenActive');
        await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: true });
        await service().lookup(opaque, resource.resource);
        await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false });
        await service().revoke(opaque);
        assert.equal((await model().get({ id: row.id }))?.state, 'revoked');
        await expectOAuth(() => service().lookup(opaque, resource.resource), 'invalid_token');
      });
    });
  });

  it('inherits the registered scope and canonicalizes requests for both discovered scopes', async () => {
    for (const [registrationScope, requestedScope, expected] of [
      [undefined, undefined, 'mcp:all'],
      ['mcp:read', undefined, 'mcp:read'],
      [undefined, 'mcp:all', 'mcp:all'],
      [undefined, 'mcp:all mcp:read', 'mcp:all'],
      [undefined, 'mcp:read mcp:all', 'mcp:all'],
    ] as const) {
      await withFixture(
        async fixture => {
          const params = authorizationParams(fixture.clientId);
          if (requestedScope === undefined) params.delete('scope');
          else params.set('scope', requestedScope);
          const request = await app.bean.executor.mockCtx(() =>
            service().authorize(params, resource),
          );
          await app.bean.executor.mockCtx(async () => {
            assert.equal((await model().get({ requestDigest: sha256(request) }))?.scope, expected);
          });
          const decision = await asUser(fixture, async () => {
            assert.equal((await service().summary(request)).scope, expected);
            return await service().decide(request, true);
          });
          const code = new URL(decision.redirectUrl).searchParams.get('code')!;
          await app.bean.executor.mockCtx(async () => {
            assert.equal((await model().get({ codeDigest: sha256(code) }))?.scope, expected);
          });
          const token = await redeem(fixture, code);
          assert.equal(token.scope, expected);
          await app.bean.executor.mockCtx(async () => {
            const payload = await accessPayload(token.access_token);
            assert.equal(
              (await model().get({ tokenDigest: sha256(payload.token) }))?.scope,
              expected,
            );
            const passport = await service().lookup(token.access_token, resource.resource);
            assert.equal(String(passport.user!.id), String(fixture.userId));
            const context = await service().lookupContext(token.access_token, resource.resource);
            assert.equal(context.scope, expected);
            assert.deepEqual(context.passport, passport);
            const client = await app
              .scope('mcp-auth')
              .service.registration.resolve(fixture.clientId, resource.resource);
            assert.equal(client?.scope, registrationScope ?? 'mcp:all');
          });
        },
        'none',
        registrationScope,
      );
    }
  });

  it('rejects read-client escalation before persisting an authorization', async () => {
    await withFixture(
      async fixture => {
        await app.bean.executor.mockCtx(async () => {
          for (const scope of ['mcp:all', 'mcp:all mcp:read', 'mcp:read mcp:all']) {
            const params = authorizationParams(fixture.clientId);
            params.set('scope', scope);
            await expectOAuth(() => service().authorize(params, resource), 'invalid_scope');
          }
          assert.equal(
            (await model().builderSelect().where({ oauthClientId: fixture.clientId })).length,
            0,
          );
          assert.equal(
            (
              await app
                .scope('mcp-auth')
                .service.registration.resolve(fixture.clientId, resource.resource)
            )?.scope,
            'mcp:read',
          );
        });
      },
      'none',
      'mcp:read',
    );
  });

  it('rechecks client-scope containment at summary, decision, exchange and token lookup', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.clientId;
      const params = authorizationParams(clientId);
      params.delete('scope');
      const request = await app.bean.executor.mockCtx(() => service().authorize(params, resource));
      const setClientScope = async (scope: string) => {
        await app.bean.executor.mockCtx(async () => {
          await app
            .scope('mcp-auth')
            .model.client.builderSelect()
            .where({ oauthClientId: clientId })
            .update({ scope });
        });
      };
      await setClientScope('mcp:read');
      await asUser(fixture, async () => {
        await expectOAuth(() => service().summary(request), 'invalid_grant');
        await expectOAuth(() => service().decide(request, true), 'invalid_grant');
      });
      await app.bean.executor.mockCtx(async () => {
        const row = await model().get({ requestDigest: sha256(request) });
        assert.equal(row?.state, 'pending');
        assert.equal(row?.scope, 'mcp:all');
        assert.equal(row?.codeDigest, '');
      });
      await setClientScope('mcp:all');
      const decision = await asUser(fixture, () => service().decide(request, true));
      const code = new URL(decision.redirectUrl).searchParams.get('code')!;
      await setClientScope('mcp:read');
      await expectOAuth(() => redeem(fixture, code), 'invalid_grant');
      await app.bean.executor.mockCtx(async () => {
        const row = await model().get({ codeDigest: sha256(code) });
        assert.equal(row?.state, 'codeReady');
        assert.equal(row?.tokenDigest, '');
      });
      await setClientScope('mcp:all');
      const token = await redeem(fixture, code);
      assert.equal(token.scope, 'mcp:all');
      await setClientScope('mcp:read');
      await app.bean.executor.mockCtx(async () => {
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
        await expectOAuth(
          () => service().lookupContext(token.access_token, resource.resource),
          'invalid_token',
        );
      });
    });
  });

  it('rejects noncanonical persisted authorization scopes without silently promoting them', async () => {
    await withFixture(async fixture => {
      const request = await app.bean.executor.mockCtx(() =>
        service().authorize(authorizationParams(fixture.clientId), resource),
      );
      await app.bean.executor.mockCtx(async () => {
        await model()
          .builderSelect()
          .where({ requestDigest: sha256(request) })
          .update({ scope: 'mcp:all mcp:read' });
      });
      await asUser(fixture, async () => {
        await expectOAuth(() => service().summary(request), 'invalid_grant');
        await expectOAuth(() => service().decide(request, true), 'invalid_grant');
      });
      await app.bean.executor.mockCtx(async () => {
        const row = await model().get({ requestDigest: sha256(request) });
        assert.equal(row?.state, 'pending');
        assert.equal(row?.scope, 'mcp:all mcp:read');
        assert.equal(row?.codeDigest, '');
        await model()
          .builderSelect()
          .where({ requestDigest: sha256(request) })
          .update({ scope: 'mcp:read' });
      });
      const decision = await asUser(fixture, () => service().decide(request, true));
      const code = new URL(decision.redirectUrl).searchParams.get('code')!;
      await app.bean.executor.mockCtx(async () => {
        await model()
          .builderSelect()
          .where({ requestDigest: sha256(request) })
          .update({ scope: 'mcp:all mcp:read' });
        await expectOAuth(
          () => service().exchange(tokenParams(fixture.clientId, code), undefined),
          'invalid_grant',
        );
        const row = await model().get({ requestDigest: sha256(request) });
        assert.equal(row?.state, 'codeReady');
        assert.equal(row?.tokenDigest, '');
        await model()
          .builderSelect()
          .where({ requestDigest: sha256(request) })
          .update({ scope: 'mcp:read' });
      });
      const token = await redeem(fixture, code);
      assert.equal(token.scope, 'mcp:read');
      await app.bean.executor.mockCtx(async () => {
        for (const scope of [
          '',
          'mcp:write',
          'mcp:all mcp:read',
          'mcp:read mcp:all',
          ' mcp:read',
        ]) {
          await model()
            .builderSelect()
            .where({ requestDigest: sha256(request) })
            .update({ scope });
          await expectOAuth(
            () => service().lookup(token.access_token, resource.resource),
            'invalid_token',
          );
          assert.equal((await model().get({ requestDigest: sha256(request) }))?.scope, scope);
        }
        await model()
          .builderSelect()
          .where({ requestDigest: sha256(request) })
          .update({ scope: 'mcp:read' });
        assert.equal(
          String((await service().lookup(token.access_token, resource.resource)).user!.id),
          String(fixture.userId),
        );
      });
    });
  });

  it('rejects invalid contracts before persistence and enforces current instance and confidentiality', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.clientId;
      await app.bean.executor.mockCtx(async () => {
        for (const [name, value, error] of [
          ['redirect_uri', 'https://evil.example/callback', 'invalid_request'],
          ['resource', 'https://evil.example/mcp', 'invalid_target'],
          ['scope', 'mcp:write', 'invalid_scope'],
          ['scope', '', 'invalid_scope'],
          ['scope', 'mcp:read mcp:read', 'invalid_scope'],
          ['scope', 'mcp:all mcp:all', 'invalid_scope'],
          ['scope', 'mcp:all  mcp:read', 'invalid_scope'],
          ['scope', 'mcp:all\tmcp:read', 'invalid_scope'],
          ['scope', ' mcp:all', 'invalid_scope'],
          ['scope', 'mcp:all offline_access', 'invalid_scope'],
          ['code_challenge_method', 'plain', 'invalid_request'],
        ]) {
          const params = authorizationParams(clientId);
          params.set(name, value);
          await expectOAuth(() => service().authorize(params, resource), error);
        }
        const duplicate = authorizationParams(clientId);
        duplicate.append('client_id', clientId);
        await expectOAuth(() => service().authorize(duplicate, resource), 'invalid_request');
        await expectOAuth(
          () =>
            service().authorize(authorizationParams(clientId), {
              ...resource,
              instanceName: 'foreign',
            }),
          'invalid_target',
        );
        assert.equal((await model().builderSelect().where({ oauthClientId: clientId })).length, 0);
      });
      const { code } = await issueCode(fixture);
      await app.bean.executor.mockCtx(async () => {
        const wrongVerifier = tokenParams(clientId, code);
        wrongVerifier.set('code_verifier', 'x'.repeat(43));
        await expectOAuth(() => service().exchange(wrongVerifier, undefined), 'invalid_grant');
        const wrongRedirect = tokenParams(clientId, code);
        wrongRedirect.set('redirect_uri', `${callback}&extra=1`);
        await expectOAuth(() => service().exchange(wrongRedirect, undefined), 'invalid_grant');
      });
      const token = await redeem(fixture, code);
      await app.bean.executor.mockCtx(
        async () => {
          await expectOAuth(
            () => service().authorize(authorizationParams(clientId), resource),
            'invalid_target',
          );
          await expectOAuth(
            () => service().lookup(token.access_token, resource.resource),
            'invalid_target',
          );
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        await expectOAuth(
          () => service().lookup(token.access_token, 'https://other.example.test/mcp'),
          'invalid_target',
        );
        await app.scope('home-user').model.user.updateById(fixture.userId, { activated: false });
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
        await app.scope('home-user').model.user.updateById(fixture.userId, { activated: true });
        await app
          .scope('home-user')
          .model.user.updateById(fixture.userId, { accountStatus: 'disabled' });
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
        await app
          .scope('home-user')
          .model.user.updateById(fixture.userId, { accountStatus: 'active' });
        const auth = await app.scope('a-auth').model.auth.get({ userId: fixture.userId });
        await app.scope('a-auth').model.auth.updateById(auth!.id, { userId: -1 });
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
        await app.scope('a-auth').model.auth.updateById(auth!.id, { userId: fixture.userId });
        const payload = await accessPayload(token.access_token);
        await model()
          .builderSelect()
          .where({ tokenDigest: sha256(payload.token) })
          .update({ tokenExpiresAt: Date.now() - 1, expiresAt: Date.now() - 1 });
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
      });
    });
  });

  it('denies and expires pending/code state without issuing, and rejects ambient issuance transactions', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.clientId;
      const request = await app.bean.executor.mockCtx(() =>
        service().authorize(authorizationParams(clientId), resource),
      );
      const denied = await asUser(fixture, () => service().decide(request, false));
      assert.equal(new URL(denied.redirectUrl).searchParams.get('error'), 'access_denied');
      assert.equal(new URL(denied.redirectUrl).searchParams.has('code'), false);
      await asUser(fixture, () =>
        expectOAuth(() => service().decide(request, true), 'invalid_request'),
      );
      const expired = await app.bean.executor.mockCtx(() =>
        service().authorize(authorizationParams(clientId), resource),
      );
      await app.bean.executor.mockCtx(async () => {
        await model()
          .builderSelect()
          .where({ requestDigest: sha256(expired) })
          .update({ pendingExpiresAt: Date.now() - 1, expiresAt: Date.now() - 1 });
      });
      await asUser(fixture, () => expectOAuth(() => service().summary(expired), 'invalid_request'));
      const { code } = await issueCode(fixture);
      await app.bean.executor.mockCtx(async () => {
        await model()
          .builderSelect()
          .where({ codeDigest: sha256(code) })
          .update({ codeExpiresAt: Date.now() - 1, expiresAt: Date.now() - 1 });
        await expectOAuth(
          () => service().exchange(tokenParams(clientId, code), undefined),
          'invalid_grant',
        );
        await app.bean.database.current.transaction.begin(async () => {
          await expectOAuth(
            () => service().authorize(authorizationParams(clientId), resource),
            'server_error',
          );
        });
        await service().cleanupExpired();
        assert.equal((await model().builderSelect().where({ oauthClientId: clientId })).length, 0);
      });
    });
  });

  it('authenticates dynamically registered confidential clients by Basic digest only', async () => {
    await withFixture(async fixture => {
      const secret = fixture.clientSecret!;
      assert.ok(secret);
      const { code } = await issueCode(fixture);
      const params = tokenParams(fixture.clientId, code);
      await app.bean.executor.mockCtx(async () => {
        const client = await app
          .scope('mcp-auth')
          .model.client.get({ oauthClientId: fixture.clientId });
        assert.equal(client!.secretSha256, sha256(secret));
        assert.notEqual(client!.secretSha256, secret);
        await expectOAuth(() => service().exchange(params, undefined), 'invalid_client');
        params.delete('client_id');
        const basic = (value: string) =>
          `Basic ${Buffer.from(`${encodeURIComponent(fixture.clientId)}:${encodeURIComponent(value)}`).toString('base64')}`;
        await expectOAuth(() => service().exchange(params, basic('wrong')), 'invalid_client');
        const token = await service().exchange(params, basic(secret));
        assert.equal(
          (await service().lookup(token.access_token, resource.resource)).user!.id,
          fixture.userId,
        );
        await app.scope('mcp-auth').service.registration.disable(fixture.clientId);
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
      });
    }, 'client_secret_basic');
  });

  it('has exactly one durable decision and redemption winner across separate contexts', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.clientId;
      const request = await app.bean.executor.mockCtx(() =>
        service().authorize(authorizationParams(clientId), resource),
      );
      const decisions = await Promise.allSettled([
        asUser(fixture, () => service().decide(request, true)),
        asUser(fixture, () => service().decide(request, true)),
      ]);
      const winners = decisions.filter(result => result.status === 'fulfilled');
      assert.equal(winners.length, 1);
      const code = new URL(winners[0].value.redirectUrl).searchParams.get('code')!;
      const redemptions = await Promise.allSettled([redeem(fixture, code), redeem(fixture, code)]);
      const tokens = redemptions.filter(result => result.status === 'fulfilled');
      assert.equal(tokens.length, 1);
      await app.bean.executor.mockCtx(async () => {
        const rows = await model().builderSelect().where({ oauthClientId: clientId });
        assert.equal(rows.length, 1);
        assert.equal(rows[0].state, 'tokenActive');
        assert.equal(rows[0].codeDigest, '');
        const payload = await accessPayload(tokens[0].value.access_token);
        assert.equal(rows[0].tokenDigest, sha256(payload.token));
      });
    });
  });
});
