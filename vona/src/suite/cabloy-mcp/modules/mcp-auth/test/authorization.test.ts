import type { TableIdentity } from 'table-identity';

import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

import type { IMcpAuthConfig } from '../src/types/index.ts';

import { config as defaultConfig } from '../src/config/config.ts';
import {
  getMcpAuthConfig,
  OAuthError,
  resolveMcpResource,
  sha256,
  validateMcpAuthConfig,
} from '../src/lib/authorization.ts';

const resource = { resource: 'https://mcp.example.test/mcp', instanceName: '' };
const verifier = 'v'.repeat(43);
const challenge = createHash('sha256').update(verifier).digest('base64url');
const callback = 'https://client.example.test/callback?existing=1';
const password = 'mcp-authorization-test-password';

interface Fixture {
  config: IMcpAuthConfig;
  userId: TableIdentity;
  name: string;
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
async function expectOAuth(operation: () => Promise<unknown>, code: string) {
  await assert.rejects(
    operation,
    error => error instanceof OAuthError && error.oauthError === code,
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
async function withFixture(operation: (fixture: Fixture) => Promise<void>) {
  // Same lock as the RS tests: both temporarily own the global registration fixture.
  const release = await acquireTestLock('mcp-test');
  const original = structuredClone(app.config.modules['mcp-auth']);
  const name = `mcp-auth-${randomUUID()}`;
  const clientId = `client-${randomUUID()}`;
  let userId: TableIdentity | undefined;
  let authId: TableIdentity | undefined;
  let profileId: TableIdentity | undefined;
  const config: IMcpAuthConfig = {
    issuer: 'https://mcp.example.test',
    resources: [resource],
    clients: [
      {
        clientId,
        name: 'Test client',
        redirectUris: [callback],
        authentication: 'none',
        resources: [resource.resource],
      },
    ],
    pendingTtl: 600,
    codeTtl: 60,
    tokenTtl: 900,
    allowLoopbackHttp: false,
  };
  try {
    Object.assign(app.config.modules['mcp-auth'], config);
    await app.bean.executor.mockCtx(async () => {
      const user = await app.bean.user.register({ name }, true);
      userId = user.id;
      const profile = await app
        .scope('auth-simple')
        .service.authSimple.createForUser(user.id, password);
      profileId = profile!.id;
      const auth = await app.scope('a-auth').model.auth.get({ userId });
      authId = auth!.id;
    });
    await operation({ config, userId: userId!, name });
  } finally {
    try {
      await app.bean.executor.mockCtx(async () => {
        await model()
          .builderSelect()
          .whereIn(
            'clientId',
            config.clients.map(client => client.clientId),
          )
          .delete();
        if (authId !== undefined) await app.scope('a-auth').model.auth.deleteById(authId);
        if (profileId !== undefined)
          await app.scope('auth-simple').model.authSimple.deleteById(profileId);
        if (userId !== undefined) {
          await app.scope('home-user').model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
      });
    } finally {
      Object.assign(app.config.modules['mcp-auth'], original);
      release();
    }
  }
}
async function issueCode(fixture: Fixture) {
  const request = await app.bean.executor.mockCtx(() =>
    service().authorize(authorizationParams(fixture.config.clients[0].clientId), resource),
  );
  const decision = await asUser(fixture, () => service().decide(request, true));
  const code = new URL(decision.redirectUrl).searchParams.get('code')!;
  return { request, code };
}
async function redeem(fixture: Fixture, code: string) {
  return await app.bean.executor.mockCtx(() =>
    service().exchange(tokenParams(fixture.config.clients[0].clientId, code), undefined),
  );
}

describe('authorization.test.ts', { concurrency: false }, () => {
  it('validates closed defaults, canonical allowlists, redirects and issuer policy', () => {
    assert.deepEqual(validateMcpAuthConfig(defaultConfig(app)), {
      issuer: '',
      resources: [],
      clients: [],
      pendingTtl: 600,
      codeTtl: 60,
      tokenTtl: 900,
      allowLoopbackHttp: false,
    });
    const config: IMcpAuthConfig = {
      ...defaultConfig(app),
      issuer: 'https://mcp.example.test',
      resources: [resource],
      clients: [
        {
          clientId: 'client',
          name: 'Client',
          redirectUris: [callback],
          authentication: 'none',
          resources: [resource.resource],
        },
      ],
    };
    assert.equal(validateMcpAuthConfig(config), config);
    for (const patch of [
      { issuer: 'https://mcp.example.test/path' },
      { resources: [{ ...resource, resource: `${resource.resource}?query=1` }] },
      { resources: [resource, resource] },
      {
        clients: [
          { ...config.clients[0], redirectUris: ['https://client.example.test/#fragment'] },
        ],
      },
      { clients: [{ ...config.clients[0], authentication: 'client_secret_basic' as const }] },
      { tokenTtl: 0 },
    ]) {
      assert.throws(() => validateMcpAuthConfig({ ...config, ...patch }), OAuthError);
    }
    const local = {
      ...config,
      issuer: 'http://127.0.0.1:7102',
      resources: [{ resource: 'http://127.0.0.1:7102/mcp', instanceName: '' }],
      clients: [],
    };
    assert.throws(() => validateMcpAuthConfig(local), OAuthError);
    assert.equal(validateMcpAuthConfig({ ...local, allowLoopbackHttp: true }).issuer, local.issuer);
  });

  it('uses existing real login and one-row digests through approval, exchange and revocation', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.config.clients[0].clientId;
      const request = await app.bean.executor.mockCtx(async () => {
        assert.equal(getMcpAuthConfig(app).issuer, fixture.config.issuer);
        assert.deepEqual(resolveMcpResource(app, 'mcp.example.test'), resource);
        assert.throws(() => resolveMcpResource(app, 'attacker.example.test'), OAuthError);
        return await service().authorize(authorizationParams(clientId), resource);
      });
      await app.bean.executor.mockCtx(() =>
        expectOAuth(() => service().summary(request), 'access_denied'),
      );
      await app.bean.executor.mockCtx(() =>
        expectOAuth(() => service().decide(request, true), 'access_denied'),
      );
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
      const token = await redeem(fixture, code);
      assert.equal(token.token_type, 'Bearer');
      assert.equal(token.expires_in, 900);
      await app.bean.executor.mockCtx(async () => {
        const rows = await model().builderSelect().where({ clientId });
        assert.equal(rows.length, 1);
        assert.equal(rows[0].requestDigest, sha256(request));
        assert.equal(rows[0].codeDigest, '');
        assert.equal(rows[0].tokenDigest, sha256(token.access_token));
        assert.ok(!JSON.stringify(rows).includes(token.access_token));
        const passport = await service().lookup(token.access_token, resource.resource);
        assert.equal(String(passport.user!.id), String(fixture.userId));
        assert.ok(passport.auth);
        assert.ok(passport.roles?.some(role => role.name === 'registeredUser'));
        await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
        assert.deepEqual((await service().lookup(token.access_token, resource.resource)).roles, []);
        await expectOAuth(
          () => service().exchange(tokenParams(clientId, code), undefined),
          'invalid_grant',
        );
        await service().revoke(token.access_token);
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
      });
    });
  });

  it('rejects invalid contracts before persistence and enforces current instance and confidentiality', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.config.clients[0].clientId;
      await app.bean.executor.mockCtx(async () => {
        for (const [name, value, error] of [
          ['redirect_uri', 'https://evil.example/callback', 'invalid_request'],
          ['resource', 'https://evil.example/mcp', 'invalid_target'],
          ['scope', 'mcp:write', 'invalid_scope'],
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
        assert.equal((await model().builderSelect().where({ clientId })).length, 0);
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
      await app.bean.executor.mockCtx(async () => {
        fixture.config.resources[0] = { ...resource, instanceName: 'shareTest' };
        Object.assign(app.config.modules['mcp-auth'], fixture.config);
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_target',
        );
        fixture.config.resources[0] = resource;
        Object.assign(app.config.modules['mcp-auth'], fixture.config);
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
        await model()
          .builderSelect()
          .where({ tokenDigest: sha256(token.access_token) })
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
      const clientId = fixture.config.clients[0].clientId;
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
        assert.equal((await model().builderSelect().where({ clientId })).length, 0);
      });
    });
  });

  it('authenticates preregistered confidential clients by Basic digest only', async () => {
    await withFixture(async fixture => {
      const secret = randomBytes(32).toString('base64url');
      fixture.config.clients[0].authentication = 'client_secret_basic';
      fixture.config.clients[0].secretSha256 = sha256(secret);
      Object.assign(app.config.modules['mcp-auth'], fixture.config);
      const { code } = await issueCode(fixture);
      const params = tokenParams(fixture.config.clients[0].clientId, code);
      await app.bean.executor.mockCtx(async () => {
        await expectOAuth(() => service().exchange(params, undefined), 'invalid_client');
        params.delete('client_id');
        const basic = (value: string) =>
          `Basic ${Buffer.from(`${encodeURIComponent(fixture.config.clients[0].clientId)}:${encodeURIComponent(value)}`).toString('base64')}`;
        await expectOAuth(() => service().exchange(params, basic('wrong')), 'invalid_client');
        const token = await service().exchange(params, basic(secret));
        assert.equal(
          (await service().lookup(token.access_token, resource.resource)).user!.id,
          fixture.userId,
        );
        fixture.config.clients[0].redirectUris = ['https://client.example.test/changed'];
        Object.assign(app.config.modules['mcp-auth'], fixture.config);
        await expectOAuth(
          () => service().lookup(token.access_token, resource.resource),
          'invalid_token',
        );
      });
    });
  });

  it('has exactly one durable decision and redemption winner across separate contexts', async () => {
    await withFixture(async fixture => {
      const clientId = fixture.config.clients[0].clientId;
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
        const rows = await model().builderSelect().where({ clientId });
        assert.equal(rows.length, 1);
        assert.equal(rows[0].state, 'tokenActive');
        assert.equal(rows[0].codeDigest, '');
        assert.equal(rows[0].tokenDigest, sha256(tokens[0].value.access_token));
      });
    });
  });
});
