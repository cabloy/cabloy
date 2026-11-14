import type { TableIdentity } from 'table-identity';
import type { DtoAuthorizationGrantMineRes, EntityAuthorization } from 'vona-module-mcp-auth';

import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import {
  authorizationGrantColumns,
  getMcpIssuer,
  OAuthError,
  resolveMcpResource,
  resolveMcpInstance,
  sha256,
} from 'vona-module-mcp-auth';

const callback = 'https://grant-client.example.test/callback';
const verifier = 'g'.repeat(43);
const challenge = createHash('sha256').update(verifier).digest('base64url');
const basePath = '/api/mcp/auth/authorizationGrant';

interface UserFixture {
  id: TableIdentity;
  authId: TableIdentity;
  profileId: TableIdentity;
  token: string;
}

interface Fixture {
  users: UserFixture[];
  clientId: string;
  grantIds: TableIdentity[];
  foreignGrantIds: TableIdentity[];
  clientIds: string[];
}

const scope = () => app.scope('mcp-auth');
const siteResource = () => `${getMcpIssuer(app)}/web`;

async function asUser<T>(user: UserFixture, operation: () => Promise<T>): Promise<T> {
  return await app.bean.executor.mockCtx(async () => {
    await app.bean.passport.checkAuthToken(user.token);
    try {
      return await operation();
    } finally {
      await app.bean.passport.setCurrent(undefined);
    }
  });
}

async function api(method: string, path: string, user?: UserFixture) {
  assert.ok(app.server?.listening);
  const address = app.server.address();
  assert.ok(address && typeof address === 'object');
  const target = new URL(`${basePath}${path}`, new URL(getMcpIssuer(app)).origin);
  if (!target.searchParams.has('ssrSiteId')) target.searchParams.set('ssrSiteId', 'web');
  const response = await fetch(target, {
    method,
    headers: {
      accept: 'application/json',
      host: new URL(getMcpIssuer(app)).host,
      ...(user ? { authorization: `Bearer ${user.token}` } : {}),
    },
  });
  const body = (await response.json()) as { code: number; data: any };
  return { response, body };
}

async function withFixture(operation: (fixture: Fixture) => Promise<void>) {
  // Other MCP suites temporarily own registration policy under this same lock.
  const release = await acquireTestLock('test-mcp');
  const fixture: Fixture = {
    users: [],
    clientId: '',
    clientIds: [],
    grantIds: [],
    foreignGrantIds: [],
  };
  const userIds: TableIdentity[] = [];
  const authIds: TableIdentity[] = [];
  const profileIds: TableIdentity[] = [];
  try {
    await app.bean.executor.mockCtx(async () => {
      const client = await scope().service.registration.register(
        {
          client_name: 'Own authorization client',
          redirect_uris: [callback],
          token_endpoint_auth_method: 'none',
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          scope: 'mcp:read',
        },
        resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
      );
      fixture.clientId = client.client_id;
      fixture.clientIds.push(client.client_id);
      for (let index = 0; index < 2; index++) {
        const user = await app.bean.user.register({ name: `mcp-grant-${randomUUID()}` }, true);
        userIds.push(user.id);
        const profile = await app
          .scope('auth-simple')
          .service.authSimple.createForUser(user.id, 'mcp-grant-test-password');
        assert.ok(profile);
        profileIds.push(profile.id);
        const auth = await app.scope('a-auth').model.auth.get({ userId: user.id });
        assert.ok(auth);
        authIds.push(auth.id);
        const jwt = await app.bean.passport.signin({
          user,
          auth,
          roles: await app.bean.role.findAllByUserId(user.id),
        });
        fixture.users.push({
          id: user.id,
          authId: auth.id,
          profileId: profile.id,
          token: jwt.accessToken,
        });
        assert.equal(await app.bean.passport.isSystemAdmin(), false);
        await app.bean.passport.setCurrent(undefined);
      }
    });
    await operation(fixture);
  } finally {
    try {
      await app.bean.executor.mockCtx(async () => {
        if (fixture.foreignGrantIds.length) {
          await app.bean.executor.mockCtx(
            async () => {
              for (const id of fixture.foreignGrantIds) {
                await scope().model.authorization.delete({ id }, { disableDeleted: true });
              }
            },
            { instanceName: 'shareTest' as any },
          );
        }
        for (const id of fixture.grantIds) {
          await scope().model.authorization.delete({ id }, { disableDeleted: true });
        }
        for (const clientId of fixture.clientIds) {
          await scope().model.client.delete({ oauthClientId: clientId }, { disableDeleted: true });
        }
        for (const user of fixture.users) {
          await app.bean.passport.checkAuthToken(user.token);
          await app.bean.passport.signout();
        }
        for (const authId of authIds) {
          await app.scope('a-auth').model.auth.deleteById(authId, { disableDeleted: true });
        }
        for (const profileId of profileIds) {
          await app
            .scope('auth-simple')
            .model.authSimple.deleteById(profileId, { disableDeleted: true });
        }
        for (const userId of userIds) {
          await app.scope('home-user').model.roleUser.delete({ userId }, { disableDeleted: true });
          await app.bean.user.removeById(userId);
        }
      });
    } finally {
      release();
    }
  }
}

async function insertGrant(
  fixture: Fixture,
  user: UserFixture,
  data: Partial<EntityAuthorization> = {},
) {
  return await app.bean.executor.mockCtx(async () => {
    const client = await scope().model.client.get({ oauthClientId: fixture.clientId });
    assert.ok(client);
    const row = await scope().model.authorization.insert({
      requestDigest: sha256(randomUUID()),
      clientId: client.id,
      oauthClientId: fixture.clientId,
      issuer: getMcpIssuer(app),
      resource: `${getMcpIssuer(app)}/web`,
      redirectUri: callback,
      scope: 'mcp:read',
      requestedScope: 'mcp:read',
      scopeTools: [],
      scopeReadOnly: true,
      oauthState: 'never-expose-state',
      codeChallenge: challenge,
      state: 'tokenActive',
      pendingExpiresAt: Date.now() + 600000,
      expiresAt: Date.now() + 600000,
      codeDigest: sha256('never-expose-code'),
      codeExpiresAt: Date.now() + 600000,
      tokenDigest: sha256('never-expose-token'),
      tokenExpiresAt: Date.now() + 600000,
      tokenVersion: 1,
      refreshEnabled: true,
      refreshGeneration: 1,
      refreshExpiresAt: Date.now() + 600000,
      userId: user.id,
      authId: user.authId,
      ...data,
    });
    fixture.grantIds.push(row.id);
    return row;
  });
}

async function issueCode(fixture: Fixture, user: UserFixture) {
  const resource = resolveMcpResource(app, new URL(getMcpIssuer(app)).host, 'web');
  const request = await app.bean.executor.mockCtx(async () => {
    const request = await scope().service.authorization.authorize(
      new URLSearchParams({
        response_type: 'code',
        client_id: fixture.clientId,
        redirect_uri: callback,
        resource: resource.resource,
        scope: 'mcp:read',
        state: 'private-state',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      resource,
    );
    const row = await scope().model.authorization.get({ requestDigest: sha256(request) });
    assert.ok(row);
    fixture.grantIds.push(row.id);
    return { request, id: row.id };
  });
  const decision = await asUser(user, () =>
    scope().service.authorization.decide(request.request, true),
  );
  return { id: request.id, code: new URL(decision.redirectUrl).searchParams.get('code')! };
}

async function redeem(fixture: Fixture, code: string) {
  return await app.bean.executor.mockCtx(() =>
    scope().service.authorization.exchange(
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: fixture.clientId,
        code,
        redirect_uri: callback,
        resource: `${getMcpIssuer(app)}/web`,
        code_verifier: verifier,
      }),
      undefined,
    ),
  );
}

async function refresh(fixture: Fixture, token: string) {
  return await app.bean.executor.mockCtx(() =>
    scope().service.authorization.exchange(
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: fixture.clientId,
        refresh_token: token,
        resource: `${getMcpIssuer(app)}/web`,
      }),
      undefined,
    ),
  );
}

async function expectOAuth(operation: () => Promise<unknown>, code: string) {
  await assert.rejects(
    operation,
    error => error instanceof OAuthError && error.oauthError === code,
  );
}

describe('authorizationGrant.test.ts', { concurrency: false }, () => {
  it('supports explicit user IDs without a signed-in Passport context', async () => {
    await withFixture(async fixture => {
      const [owner, other] = fixture.users;
      const grant = await insertGrant(fixture, owner);
      await app.bean.executor.mockCtx(async () => {
        assert.equal(app.bean.passport.isAuthenticated, false);
        const service = scope().service.authorizationGrant;
        const query = { pageNo: 1, pageSize: 20 };
        const page = await service.mine(owner.id, siteResource(), query);
        assert.deepEqual(
          page.list.map(row => String(row.id)),
          [String(grant.id)],
        );
        assert.equal((await service.mine(other.id, siteResource(), query)).total, '0');
        await service.revokeMine(other.id, siteResource(), grant.id);
        await service.deleteMine(other.id, siteResource(), grant.id);
        assert.equal((await scope().model.authorization.getById(grant.id))?.state, 'tokenActive');
        await service.revokeMine(owner.id, siteResource(), grant.id);
        assert.equal((await scope().model.authorization.getById(grant.id))?.state, 'revoked');
        await service.deleteMine(owner.id, siteResource(), grant.id);
        assert.equal(await scope().model.authorization.getById(grant.id), undefined);
      });
    });
  });

  it('admits ordinary users, rejects anonymous calls, and projects only owned bounded pages/counts', async () => {
    await withFixture(async fixture => {
      const [owner, other] = fixture.users;
      const first = await insertGrant(fixture, owner);
      const second = await insertGrant(fixture, owner, {
        state: 'denied',
        clientId: '999999999999998',
        oauthClientId: `missing-${randomUUID()}`,
      });
      assert.ok(first.clientId);
      assert.ok(second.oauthClientId);
      const firstClientId = first.clientId;
      const secondOAuthClientId = second.oauthClientId;
      const third = await insertGrant(fixture, owner, { state: 'revoked' });
      const hidden = await insertGrant(fixture, owner);
      const foreign = await insertGrant(fixture, other);
      const crossInstance = await app.bean.executor.mockCtx(
        async () => {
          // Same owner ID in a different instance must not affect the local list/count or writes.
          const row = await scope().model.authorization.insert({ ...first, id: undefined });
          fixture.foreignGrantIds.push(row.id);
          return row;
        },
        { instanceName: 'shareTest' as any },
      );
      for (const [method, action] of [
        ['POST', 'revokeMine'],
        ['DELETE', 'deleteMine'],
      ]) {
        assert.equal(
          (await api(method, `/${action}/${crossInstance.id}`, owner)).response.status,
          200,
        );
      }
      await app.bean.executor.mockCtx(
        async () => {
          const row = await scope().model.authorization.get({ id: crossInstance.id });
          assert.equal(row?.state, 'tokenActive');
          assert.equal(row?.tokenDigest, first.tokenDigest);
        },
        { instanceName: 'shareTest' as any },
      );
      const wrongResourceClient = await app.bean.executor.mockCtx(async () => {
        await scope().model.authorization.delete({ id: hidden.id });
        await scope().service.registration.disable(fixture.clientId);
        // Same identifier for another resource must never supply its display name.
        const wrongResource = `${getMcpIssuer(app)}/different`;
        const client = await scope().model.client.insert({
          oauthClientId: secondOAuthClientId,
          name: 'Wrong resource client',
          issuer: wrongResource,
          redirectUris: [callback],
          grantTypes: ['authorization_code'],
          authentication: 'none',
          scope: 'mcp:read',
          state: 'active',
          clientIdIssuedAt: Math.floor(Date.now() / 1000),
        });
        fixture.clientIds.push(secondOAuthClientId);
        return client;
      });
      for (const [method, path] of [
        ['GET', '/mine'],
        ['POST', `/revokeMine/${first.id}`],
        ['DELETE', `/deleteMine/${first.id}`],
      ]) {
        const { response, body } = await api(method, path);
        assert.equal(response.status, 401);
        assert.equal(body.code, 401);
      }
      const page = await api('GET', '/mine?pageSize=2&pageNo=1', owner);
      assert.equal(page.response.status, 200);
      assert.equal(page.response.headers.get('cache-control'), 'no-store');
      const data = page.body.data as DtoAuthorizationGrantMineRes;
      assert.equal(data.total, '3');
      assert.equal(data.pageCount, 2);
      assert.equal(data.pageNo, 1);
      assert.equal(data.pageSize, 2);
      assert.deepEqual(
        data.list.map(row => String(row.id)),
        [third.id, second.id].map(String),
      );
      assert.equal(
        data.list[0].clientName,
        'Own authorization client',
        'inactive client name remains available',
      );
      assert.equal(
        data.list[1].clientName,
        second.oauthClientId,
        'missing resource binding falls back to identifier',
      );
      for (const row of data.list) {
        assert.deepEqual(
          Object.keys(row).sort(),
          [...authorizationGrantColumns, 'clientId', 'clientName'].sort(),
        );
      }
      const next = await api('GET', '/mine?pageSize=2&pageNo=2', owner);
      assert.deepEqual(
        next.body.data.list.map(row => String(row.id)),
        [String(first.id)],
      );
      const foreignPage = await api('GET', '/mine', other);
      assert.equal(foreignPage.body.data.total, '1');
      assert.deepEqual(
        foreignPage.body.data.list.map(row => String(row.id)),
        [String(foreign.id)],
      );
      for (const query of [
        'pageSize=101',
        'pageNo=0',
        'pageSize=1.5',
        'columns=userId',
        'userId=1',
        'orders=id,asc',
        'where={}',
      ]) {
        assert.equal((await api('GET', `/mine?${query}`, owner)).response.status, 422, query);
      }
      const defaults = await api('GET', '/mine', owner);
      assert.equal(defaults.body.data.pageSize, 20);
      assert.equal(defaults.body.data.pageNo, 1);
      await app.bean.executor.mockCtx(async () => {
        const row = await scope().model.authorization.getById(first.id, {
          include: { client: true },
        });
        assert.ok(row?.client);
        assert.equal(String(row.client.id), String(first.clientId));
        assert.equal(row.client.oauthClientId, fixture.clientId);
        assert.deepEqual(Object.keys(row.client).sort(), ['id', 'issuer', 'name', 'oauthClientId']);
      });
      for (const clientId of [wrongResourceClient.id, first.clientId]) {
        // A matching external snapshot cannot authorize a wrong-resource relation;
        // a same-resource relation cannot override a mismatched external snapshot either.
        await app.bean.executor.mockCtx(() =>
          scope().model.authorization.updateById(second.id, { clientId }),
        );
        const listed = await api('GET', '/mine', owner);
        const row = listed.body.data.list.find(
          (row: DtoAuthorizationGrantMineRes['list'][number]) =>
            String(row.id) === String(second.id),
        );
        assert.ok(row);
        assert.equal(row.clientId, second.oauthClientId);
        assert.equal(row.clientName, second.oauthClientId);
      }
      await app.bean.executor.mockCtx(() => scope().model.client.deleteById(firstClientId));
      const deletedClient = await api('GET', '/mine', owner);
      for (const row of deletedClient.body.data.list) {
        assert.equal(typeof row.clientId, 'string');
        assert.equal(
          row.clientName,
          row.clientId,
          'deleted relation falls back to external snapshot',
        );
        assert.deepEqual(
          Object.keys(row).sort(),
          [...authorizationGrantColumns, 'clientId', 'clientName'].sort(),
        );
      }
    });
  });

  it('mutations enforce ownership in the write and are no-data idempotent for foreign/missing/terminal grants', async () => {
    await withFixture(async fixture => {
      const [owner, other] = fixture.users;
      const grant = await insertGrant(fixture, owner);
      const denied = await insertGrant(fixture, owner, { state: 'denied' });
      for (const method of ['POST', 'DELETE']) {
        const action = method === 'POST' ? 'revokeMine' : 'deleteMine';
        const foreign = await api(method, `/${action}/${grant.id}`, other);
        assert.equal(foreign.response.status, 200);
        assert.equal(foreign.response.headers.get('cache-control'), 'no-store');
        assert.equal(foreign.body.data, null);
        const missing = await api(method, `/${action}/999999999999999`, owner);
        assert.equal(missing.response.status, 200);
        assert.equal(missing.body.data, null);
      }
      await app.bean.executor.mockCtx(async () => {
        const row = await scope().model.authorization.get({ id: grant.id });
        assert.equal(row?.state, 'tokenActive');
        assert.equal(row?.tokenDigest, grant.tokenDigest);
      });
      await api('POST', `/revokeMine/${denied.id}`, owner);
      await app.bean.executor.mockCtx(async () => {
        const row = await scope().model.authorization.get({ id: denied.id });
        assert.equal(row?.state, 'denied');
        assert.equal(row?.codeDigest, denied.codeDigest);
      });
      const now = Date.now();
      for (let index = 0; index < 2; index++) {
        const revoked = await api('POST', `/revokeMine/${grant.id}`, owner);
        assert.equal(revoked.response.status, 200);
        assert.equal(revoked.body.data, null);
      }
      await app.bean.executor.mockCtx(async () => {
        const row = await scope().model.authorization.get({ id: grant.id });
        assert.equal(row?.state, 'revoked');
        assert.equal(row?.codeDigest, '');
        assert.equal(row?.tokenDigest, '');
        assert.ok(Number(row?.expiresAt) >= now && Number(row?.expiresAt) <= Date.now());
      });
      for (let index = 0; index < 2; index++) {
        const deleted = await api('DELETE', `/deleteMine/${grant.id}`, owner);
        assert.equal(deleted.response.status, 200);
        assert.equal(deleted.body.data, null);
      }
      await app.bean.executor.mockCtx(async () => {
        assert.equal(await scope().model.authorization.get({ id: grant.id }), undefined);
        const rows = await scope().model.authorization.select(
          { where: { id: grant.id } },
          { disableDeleted: true },
        );
        assert.equal(rows.length, 1, 'delete keeps the ordinary soft-deleted row');
        assert.equal(rows[0].deleted, true);
      });
    });
  });

  it('revoke and delete invalidate authorization codes, access tokens and refresh tokens', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      for (const action of ['revokeMine', 'deleteMine']) {
        const method = action === 'revokeMine' ? 'POST' : 'DELETE';
        const codeGrant = await issueCode(fixture, owner);
        assert.equal((await api(method, `/${action}/${codeGrant.id}`, owner)).response.status, 200);
        await expectOAuth(() => redeem(fixture, codeGrant.code), 'invalid_grant');
        const tokenGrant = await issueCode(fixture, owner);
        const token = await redeem(fixture, tokenGrant.code);
        assert.ok(token.refresh_token);
        await app.bean.executor.mockCtx(() =>
          scope().service.authorization.lookup(token.access_token, `${getMcpIssuer(app)}/web`),
        );
        assert.equal(
          (await api(method, `/${action}/${tokenGrant.id}`, owner)).response.status,
          200,
        );
        await expectOAuth(
          () =>
            app.bean.executor.mockCtx(() =>
              scope().service.authorization.lookup(token.access_token, `${getMcpIssuer(app)}/web`),
            ),
          'invalid_token',
        );
        await expectOAuth(() => refresh(fixture, token.refresh_token!), 'invalid_grant');
      }
    });
  });

  it('concurrent refresh or code exchange cannot resurrect a revoked grant across request contexts', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      for (const exchangeCode of [true, false]) {
        const grant = await issueCode(fixture, owner);
        const token = exchangeCode ? undefined : await redeem(fixture, grant.code);
        // Both branches own separate mockCtx boundaries, never shared request state.
        const results = await Promise.allSettled([
          exchangeCode ? redeem(fixture, grant.code) : refresh(fixture, token!.refresh_token!),
          app.bean.executor.mockCtx(() =>
            scope().service.authorizationGrant.revokeMine(owner.id, siteResource(), grant.id),
          ),
        ]);
        assert.equal(results[1].status, 'fulfilled');
        await app.bean.executor.mockCtx(async () => {
          const row = await scope().model.authorization.get({ id: grant.id });
          assert.equal(row?.state, 'revoked');
          assert.equal(row?.codeDigest, '');
          assert.equal(row?.tokenDigest, '');
        });
        if (results[0].status === 'fulfilled') {
          const issued = results[0].value!;
          await expectOAuth(
            () =>
              app.bean.executor.mockCtx(() =>
                scope().service.authorization.lookup(
                  issued.access_token,
                  `${getMcpIssuer(app)}/web`,
                ),
              ),
            'invalid_token',
          );
          if (issued.refresh_token)
            await expectOAuth(() => refresh(fixture, issued.refresh_token!), 'invalid_grant');
        }
        await expectOAuth(() => redeem(fixture, grant.code), 'invalid_grant');
      }
    });
  });
});
