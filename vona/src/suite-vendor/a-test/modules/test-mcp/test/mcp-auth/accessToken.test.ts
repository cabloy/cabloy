import type { JSONRPCMessage, JSONRPCRequest, Server } from '@modelcontextprotocol/server';
import type { TableIdentity } from 'table-identity';
import type {
  DtoAccessToken,
  DtoAccessTokenCreate,
  DtoAccessTokenCreateRes,
  IMcpTokenPayload,
} from 'vona-module-mcp-auth';

import { InMemoryTransport } from '@modelcontextprotocol/server';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import {
  getMcpIssuer,
  OAuthError,
  resolveMcpResource,
  resolveMcpInstance,
  sha256,
} from 'vona-module-mcp-auth';

const basePath = '/api/mcp/auth/accessToken';
const callback = 'https://personal-token.example.test/callback';
const verifier = 'p'.repeat(43);
const challenge = createHash('sha256').update(verifier).digest('base64url');
const day = 86400;
const safeColumns = ['id', 'name', 'scope', 'createdAt', 'tokenExpiresAt', 'status'];
const scope = () => app.scope('mcp-auth');
const siteResource = () => `${getMcpIssuer(app)}/web`;
const context = <T>(operation: () => Promise<T>) => app.bean.executor.mockCtx(operation);

interface UserFixture {
  id: TableIdentity;
  authId?: TableIdentity;
  profileId?: TableIdentity;
  token?: string;
}

interface Fixture {
  users: UserFixture[];
  tokenIds: TableIdentity[];
  scopeIds: TableIdentity[];
  clientIds: string[];
  roleIds: TableIdentity[];
}

async function asUser<T>(user: UserFixture, operation: () => Promise<T>): Promise<T> {
  return await context(async () => {
    assert.ok(user.token);
    await app.bean.passport.checkAuthToken(user.token);
    try {
      return await operation();
    } finally {
      await app.bean.passport.setCurrent(undefined);
    }
  });
}

async function api(
  method: string,
  path: string,
  user?: UserFixture,
  body?: unknown,
  fixture?: Fixture,
) {
  assert.ok(app.server?.listening);
  const address = app.server.address();
  assert.ok(address && typeof address === 'object');
  const target = new URL(path, new URL(getMcpIssuer(app)).origin);
  if (!target.searchParams.has('ssrSiteId')) target.searchParams.set('ssrSiteId', 'web');
  const response = await fetch(target, {
    method,
    headers: {
      accept: 'application/json',
      host: new URL(getMcpIssuer(app)).host,
      ...(user ? { authorization: `Bearer ${user.token}` } : {}),
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = (await response.json()) as { code: number; data: any };
  // Own API-created rows before any response assertions can fail.
  if (method === 'POST' && path === `${basePath}/createMine` && result.data?.id !== undefined) {
    assert.ok(fixture);
    fixture.tokenIds.push(result.data.id);
  }
  return { response, body: result };
}

async function withFixture(operation: (fixture: Fixture) => Promise<void>) {
  // MCP authorization suites temporarily replace issuer/registration policy and
  // run instance-wide expiration cleanup under this same fixture-domain lock.
  const release = await acquireTestLock('test-mcp');
  const fixture: Fixture = { users: [], tokenIds: [], scopeIds: [], clientIds: [], roleIds: [] };
  try {
    await context(async () => {
      for (let index = 0; index < 2; index++) {
        const user = await app.bean.user.register({ name: `mcp-personal-${randomUUID()}` }, true);
        const owned: UserFixture = { id: user.id };
        fixture.users.push(owned);
        const profile = await app
          .scope('auth-simple')
          .service.authSimple.createForUser(user.id, 'mcp-personal-test-password');
        assert.ok(profile);
        owned.profileId = profile.id;
        const auth = await app.scope('a-auth').model.auth.get({ userId: user.id });
        assert.ok(auth);
        owned.authId = auth.id;
        const jwt = await app.bean.passport.signin({
          user,
          auth,
          roles: await app.bean.role.findAllByUserId(user.id),
        });
        owned.token = jwt.accessToken;
        assert.equal(await app.bean.passport.isSystemAdmin(), false);
        await app.bean.passport.setCurrent(undefined);
      }
    });
    await operation(fixture);
  } finally {
    try {
      await context(async () => {
        for (const id of fixture.tokenIds.toReversed()) {
          await scope().model.authorization.deleteById(id, { disableDeleted: true });
        }
        for (const id of fixture.scopeIds.toReversed()) {
          await scope().model.customScope.deleteById(id, { disableDeleted: true });
        }
        for (const clientId of fixture.clientIds.toReversed()) {
          await scope().model.client.delete({ oauthClientId: clientId }, { disableDeleted: true });
        }
        for (const user of fixture.users.toReversed()) {
          if (user.token) {
            await app.bean.passport.checkAuthToken(user.token);
            await app.bean.passport.signout();
          }
          if (user.authId !== undefined) {
            await app.scope('a-auth').model.auth.deleteById(user.authId, { disableDeleted: true });
          }
          if (user.profileId !== undefined) {
            await app
              .scope('auth-simple')
              .model.authSimple.deleteById(user.profileId, { disableDeleted: true });
          }
          await app
            .scope('home-user')
            .model.roleUser.delete({ userId: user.id }, { disableDeleted: true });
          await app.bean.user.removeById(user.id);
        }
        for (const id of fixture.roleIds.toReversed()) {
          await app.scope('home-user').model.role.deleteById(id);
        }
      });
    } finally {
      release();
    }
  }
}

async function create(
  fixture: Fixture,
  user: UserFixture,
  data: DtoAccessTokenCreate = { name: 'Personal token' },
  resource = siteResource(),
): Promise<DtoAccessTokenCreateRes> {
  return await context(async () => {
    assert.ok(user.authId !== undefined);
    const token = await scope().service.accessToken.createMine(
      user.id,
      resource,
      user.authId,
      data,
    );
    fixture.tokenIds.push(token.id);
    return token;
  });
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

async function client(fixture: Fixture) {
  return await context(async () => {
    const registered = await scope().service.registration.register(
      {
        client_name: 'Personal token isolation regression',
        redirect_uris: [callback],
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        scope: 'mcp:read',
      },
      resolveMcpInstance(app, new URL(getMcpIssuer(app)).host),
    );
    fixture.clientIds.push(registered.client_id);
    return registered.client_id;
  });
}

async function oauth(fixture: Fixture, user: UserFixture) {
  const clientId = await client(fixture);
  const request = await context(async () => {
    const request = await scope().service.authorization.authorize(
      new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: callback,
        resource: `${getMcpIssuer(app)}/web`,
        scope: 'mcp:read',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      resolveMcpResource(app, new URL(getMcpIssuer(app)).host, 'web'),
    );
    const row = await scope().model.authorization.get({ requestDigest: sha256(request) });
    assert.ok(row);
    fixture.tokenIds.push(row.id);
    return { request, id: row.id };
  });
  const decision = await asUser(user, () =>
    scope().service.authorization.decide(request.request, true),
  );
  const code = new URL(decision.redirectUrl).searchParams.get('code');
  assert.ok(code);
  const token = await context(() =>
    scope().service.authorization.exchange(
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: callback,
        resource: `${getMcpIssuer(app)}/web`,
        code_verifier: verifier,
      }),
      undefined,
    ),
  );
  return { ...request, clientId, token };
}

async function connect(server: Server) {
  const [client, transport] = InMemoryTransport.createLinkedPair();
  let id = 0;
  const pending = new Map<number, (message: any) => void>();
  client.onmessage = (message: JSONRPCMessage) => {
    if ('id' in message && typeof message.id === 'number') {
      const resolve = pending.get(message.id);
      pending.delete(message.id);
      resolve?.(message);
    }
  };
  await client.start();
  await server.connect(transport);
  const request = async (method: string, params?: Record<string, unknown>): Promise<any> => {
    const requestId = ++id;
    const response = new Promise(resolve => pending.set(requestId, resolve));
    await client.send({ jsonrpc: '2.0', id: requestId, method, params } as JSONRPCRequest);
    return await response;
  };
  await request('initialize', {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'personal-token-test', version: '1.0.0' },
  });
  await client.send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  return { request };
}

describe('accessToken.test.ts', { concurrency: false }, () => {
  it('issues finite default-seven-day and 365-day tokens without refresh or changing browser identity', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      await asUser(owner, async () => {
        const passport = app.bean.passport.current;
        const browserPayload = app.ctx.state.passportPayloadData;
        for (const expiresIn of [undefined, 365 * day]) {
          const before = Date.now();
          assert.ok(owner.authId !== undefined);
          const token = await scope().service.accessToken.createMine(
            owner.id,
            siteResource(),
            owner.authId,
            {
              name: expiresIn === undefined ? 'Default lifetime' : 'Long finite lifetime',
              ...(expiresIn === undefined ? {} : { expiresIn }),
            },
          );
          fixture.tokenIds.push(token.id);
          const after = Date.now();
          const ttl = expiresIn ?? 7 * day;
          assert.equal(token.scope, 'mcp:read');
          assert.equal(token.resource, `${getMcpIssuer(app)}/web`);
          assert.ok(token.tokenExpiresAt >= Math.floor(before / 1000) * 1000 + ttl * 1000);
          assert.ok(token.tokenExpiresAt <= after + ttl * 1000);
          assert.deepEqual(
            Object.keys(token).sort(),
            ['id', 'accessToken', 'resource', 'scope', 'tokenExpiresAt'].sort(),
          );
          const verified = await app.bean.jwt.get('mcpAccess').verify(token.accessToken);
          assert.ok(verified);
          const payload = scope().service.authTokenAdapter.payload(verified);
          assert.equal(payload.mcp.kind, 'personal');
          assert.equal(Object.hasOwn(payload.mcp, 'clientId'), false);
          assert.equal(payload.mcp.grantId, String(token.id));
          assert.equal(String(payload.userId), String(owner.id));
          assert.equal(String(payload.authId), String(owner.authId));
          const decoded = app.bean.jwt.get('mcpAccess').instance.decode(token.accessToken) as {
            exp: number;
            iat: number;
          };
          assert.equal(decoded.exp - decoded.iat, ttl);
          assert.ok(Math.abs(decoded.exp * 1000 - token.tokenExpiresAt) < 1000);
          const row = await scope().model.authorization.getById(token.id);
          assert.ok(row);
          assert.equal(String(row.userId), String(owner.id));
          assert.equal(String(row.authId), String(owner.authId));
          assert.equal(Number(row.tokenExpiresAt), token.tokenExpiresAt);
          assert.equal(row.tokenDigest, sha256(payload.token));
          assert.equal(Boolean(row.refreshEnabled), false);
          assert.equal(Number(row.refreshExpiresAt), 0);
          assert.equal(row.codeDigest, '');
          assert.ok(!JSON.stringify(row).includes(token.accessToken));
          assert.ok(!JSON.stringify(row).includes(payload.token));
          assert.equal(app.bean.passport.current, passport);
          assert.equal(app.ctx.state.passportPayloadData, browserPayload);
          assert.equal(app.ctx.state.passportAuthTokenClient, 'access');
        }
      });
    });
  });

  it('authenticates ordinary users, accepts only strict create/list inputs and returns safe owned pages', async () => {
    await withFixture(async fixture => {
      const [owner, other] = fixture.users;
      for (const [method, path, body] of [
        ['GET', `${basePath}/mine`, undefined],
        ['POST', `${basePath}/createMine`, { name: 'Anonymous' }],
        ['DELETE', `${basePath}/deleteMine/999999999999999`, undefined],
      ] as const) {
        assert.equal((await api(method, path, undefined, body)).response.status, 401);
      }
      const first = await api(
        'POST',
        `${basePath}/createMine`,
        owner,
        { name: 'First API token' },
        fixture,
      );
      assert.equal(first.response.status, 200);
      assert.equal(first.response.headers.get('cache-control'), 'no-store');
      assert.equal(first.response.headers.get('set-cookie'), null);
      const second = await create(fixture, owner, { name: 'Second owner token', scope: 'mcp:all' });
      const foreign = await create(fixture, other);
      const page = await api('GET', `${basePath}/mine?pageSize=1&pageNo=1`, owner);
      assert.equal(page.response.status, 200);
      assert.equal(page.response.headers.get('cache-control'), 'no-store');
      assert.equal(page.body.data.total, '2');
      assert.equal(page.body.data.pageCount, 2);
      assert.equal(page.body.data.pageSize, 1);
      assert.deepEqual(
        page.body.data.list.map((row: DtoAccessToken) => String(row.id)),
        [String(second.id)],
      );
      for (const row of page.body.data.list as DtoAccessToken[]) {
        assert.deepEqual(Object.keys(row).sort(), safeColumns.toSorted());
        assert.equal(row.status, 'active');
      }
      const next = await api('GET', `${basePath}/mine?pageSize=1&pageNo=2`, owner);
      assert.deepEqual(
        next.body.data.list.map((row: DtoAccessToken) => String(row.id)),
        [String(first.body.data.id)],
      );
      const otherPage = await api('GET', `${basePath}/mine`, other);
      assert.equal(otherPage.body.data.total, '1');
      assert.equal(String(otherPage.body.data.list[0].id), String(foreign.id));
      for (const body of [
        { name: '' },
        { name: 'Bad lifetime', expiresIn: 0 },
        { name: 'Bad lifetime', expiresIn: 1.5 },
        { name: 'Nonpositive coerced lifetime', expiresIn: '0' },
        { name: 'Fractional coerced lifetime', expiresIn: '1.5' },
        { name: 'Unsafe coerced lifetime', expiresIn: '9007199254740992' },
        { name: 'Foreign owner', userId: other.id },
        { name: 'Foreign auth', authId: other.authId },
        { name: 'Wrong resource', resource: 'https://foreign.example.test' },
        { name: 'Refresh forbidden', refreshEnabled: true },
        { name: 'Bad scope', scope: 'mcp:write' },
      ]) {
        assert.equal(
          (await api('POST', `${basePath}/createMine`, owner, body, fixture)).response.status,
          422,
          JSON.stringify(body),
        );
      }
      for (const query of [
        'pageSize=101',
        'pageNo=0',
        'userId=1',
        'columns=tokenDigest',
        'where={}',
      ]) {
        assert.equal(
          (await api('GET', `${basePath}/mine?${query}`, owner)).response.status,
          422,
          query,
        );
      }
      const beforeCoerced = Date.now();
      const coerced = await api(
        'POST',
        `${basePath}/createMine`,
        owner,
        {
          name: 'Framework numeric scalar coercion',
          expiresIn: String(7 * day),
        },
        fixture,
      );
      assert.equal(coerced.response.status, 200);
      assert.ok(Number.isSafeInteger(coerced.body.data.tokenExpiresAt));
      assert.ok(
        coerced.body.data.tokenExpiresAt >=
          Math.floor(beforeCoerced / 1000) * 1000 + 7 * day * 1000,
      );
      await context(async () => {
        const row = await scope().model.authorization.getById(coerced.body.data.id);
        assert.ok(row);
        assert.equal(Number(row.tokenExpiresAt), coerced.body.data.tokenExpiresAt);
        const decoded = app.bean.jwt
          .get('mcpAccess')
          .instance.decode(coerced.body.data.accessToken) as { exp: number; iat: number };
        assert.equal(decoded.exp - decoded.iat, 7 * day);
        assert.equal(decoded.exp * 1000, Number(row.tokenExpiresAt));
      });
      assert.equal(
        (await api('DELETE', `${basePath}/deleteMine/${second.id}`, other)).response.status,
        200,
      );
      await context(async () => assert.ok(await scope().model.authorization.getById(second.id)));
      assert.equal(
        (await api('DELETE', `${basePath}/deleteMine/${second.id}`, owner)).response.status,
        200,
      );
      await context(async () =>
        assert.equal(await scope().model.authorization.getById(second.id), undefined),
      );
      await asUser(owner, async () =>
        assert.equal(String(app.bean.passport.currentUser?.id), String(owner.id)),
      );
    });
  });

  it('suspends personal issuance and existing tokens on a fresh role flag without blocking management or revocation', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      const roleId = await context(async () => {
        const role = await app.scope('home-user').model.role.insert({
          name: `mcp-personal-admission-${randomUUID()}`,
          title: 'Personal MCP admission regression',
          siteIds: ['web'],
          builtin: false,
        });
        fixture.roleIds.push(role.id);
        assert.equal(
          (await app.scope('home-user').model.role.getById(role.id))?.mcpAccess,
          false,
          'ordinary roles do not implicitly grant MCP access',
        );
        await app.bean.role.replaceUserRoleIds(owner.id, [role.id]);
        return role.id;
      });
      await expectOAuth(() => create(fixture, owner), 'access_denied', 403);
      assert.equal(
        (await api('POST', `${basePath}/createMine`, owner, { name: 'Denied issuance' }, fixture))
          .response.status,
        403,
      );
      await context(async () => {
        assert.equal(
          (
            await scope().service.accessToken.mine(owner.id, siteResource(), {
              pageNo: 1,
              pageSize: 20,
            })
          ).total,
          '0',
        );
        await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: true });
      });
      const token = await create(fixture, owner);
      const revoked = await create(fixture, owner, { name: 'Revocable while suspended' });
      const before = await context(async () => {
        await scope().service.authorization.lookupContext(token.accessToken, token.resource);
        const row = await scope().model.authorization.getById(token.id);
        assert.ok(row);
        await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false });
        return row;
      });
      await context(async () => {
        await expectOAuth(
          () => scope().service.authorization.lookupContext(token.accessToken, token.resource),
          'invalid_token',
          401,
        );
        assert.deepEqual(await scope().model.authorization.getById(token.id), before);
      });
      await expectOAuth(() => create(fixture, owner), 'access_denied', 403);
      const page = await api('GET', `${basePath}/mine`, owner);
      assert.equal(page.response.status, 200);
      assert.equal(page.body.data.total, '2', 'suspension does not delete personal grants');
      await context(() =>
        app.scope('home-user').model.role.updateById(roleId, { mcpAccess: true }),
      );
      await context(async () => {
        const current = await scope().service.authorization.lookupContext(
          token.accessToken,
          token.resource,
        );
        assert.equal(String(current.passport.user?.id), String(owner.id));
        await app.scope('home-user').model.role.updateById(roleId, { mcpAccess: false });
      });
      await context(async () => {
        const payload = await app.bean.jwt.get('mcpAccess').verify(revoked.accessToken);
        assert.ok(payload);
        await scope().service.authTokenAdapter.remove(payload);
        assert.equal((await scope().model.authorization.getById(revoked.id))?.state, 'revoked');
      });
      assert.equal(
        (await api('DELETE', `${basePath}/deleteMine/${token.id}`, owner)).response.status,
        200,
      );
      await context(async () =>
        assert.equal(await scope().model.authorization.getById(token.id), undefined),
      );
    });
  });

  it('keeps personal-token and OAuth-grant management disjoint while accepting kindless OAuth JWTs', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      const personal = await create(fixture, owner);
      const grant = await oauth(fixture, owner);
      await context(async () => {
        const query = { pageNo: 1, pageSize: 20 };
        assert.deepEqual(
          (await scope().service.accessToken.mine(owner.id, siteResource(), query)).list.map(row =>
            String(row.id),
          ),
          [String(personal.id)],
        );
        assert.deepEqual(
          (await scope().service.authorizationGrant.mine(owner.id, siteResource(), query)).list.map(
            row => String(row.id),
          ),
          [String(grant.id)],
        );
        await scope().service.authorizationGrant.revokeMine(owner.id, siteResource(), personal.id);
        await scope().service.authorizationGrant.deleteMine(owner.id, siteResource(), personal.id);
        await scope().service.accessToken.deleteMine(owner.id, siteResource(), grant.id);
        assert.equal(
          (await scope().model.authorization.getById(personal.id))?.state,
          'tokenActive',
        );
        assert.equal((await scope().model.authorization.getById(grant.id))?.state, 'tokenActive');
        await scope().service.authorization.lookupContext(personal.accessToken, siteResource());
        const verified = await app.bean.jwt.get('mcpAccess').verify(grant.token.access_token);
        assert.ok(verified);
        const payload = scope().service.authTokenAdapter.payload(verified) as IMcpTokenPayload;
        assert.notEqual(payload.mcp.kind, 'personal');
        if (payload.mcp.kind === 'personal') assert.fail('OAuth issuance must not be personal');
        delete payload.mcp.kind;
        const legacy = await app.bean.jwt.get('mcpAccess').sign(payload);
        const admitted = await scope().service.authorization.lookupContext(
          legacy,
          `${getMcpIssuer(app)}/web`,
        );
        assert.equal(String(admitted.passport.user?.id), String(owner.id));
        const legacyRefresh = await app.bean.jwt.get('mcpRefresh').sign(payload);
        const rotated = await scope().service.authorization.exchange(
          new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: grant.clientId,
            refresh_token: legacyRefresh,
            resource: `${getMcpIssuer(app)}/web`,
          }),
          undefined,
        );
        assert.ok(rotated.refresh_token);
        assert.equal(
          (
            await scope().service.authorization.lookupContext(
              rotated.access_token,
              `${getMcpIssuer(app)}/web`,
            )
          ).scope,
          'mcp:read',
        );
      });
    });
  });

  it('requires the bound resource and instance and invalidates lookup immediately on owner deletion', async () => {
    await withFixture(async fixture => {
      const [owner, other] = fixture.users;
      const token = await create(fixture, owner);
      await context(async () => {
        const admitted = await scope().service.authorization.lookupContext(
          token.accessToken,
          token.resource,
        );
        assert.equal(String(admitted.passport.user?.id), String(owner.id));
        assert.equal(admitted.scope, 'mcp:read');
        await expectOAuth(
          () =>
            scope().service.authorization.lookupContext(
              token.accessToken,
              `${token.resource}/wrong`,
            ),
          'invalid_target',
        );
      });
      await app.bean.executor.mockCtx(
        async () => {
          await expectOAuth(
            () => scope().service.authorization.lookupContext(token.accessToken, token.resource),
            'invalid_target',
          );
          await scope().service.accessToken.deleteMine(owner.id, siteResource(), token.id);
          assert.deepEqual(
            (
              await scope().service.accessToken.mine(owner.id, siteResource(), {
                pageNo: 1,
                pageSize: 20,
              })
            ).list,
            [],
          );
        },
        { instanceName: 'shareTest' as any },
      );
      await context(async () => {
        await scope().service.accessToken.deleteMine(other.id, siteResource(), token.id);
        await scope().service.authorization.lookupContext(token.accessToken, token.resource);
        await scope().service.accessToken.deleteMine(owner.id, siteResource(), token.id);
        await expectOAuth(
          () => scope().service.authorization.lookupContext(token.accessToken, token.resource),
          'invalid_token',
        );
      });
    });
  });

  it('retains expired and revoked personal rows in safe management lists after cleanupExpired', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      const expired = await create(fixture, owner, { name: 'Expired personal token' });
      const revoked = await create(fixture, owner, { name: 'Revoked personal token' });
      await context(async () => {
        await scope().model.authorization.updateById(expired.id, {
          tokenExpiresAt: Date.now() - 1,
          expiresAt: Date.now() - 1,
        });
        const revokedPayload = await app.bean.jwt.get('mcpAccess').verify(revoked.accessToken);
        assert.ok(revokedPayload);
        await scope().service.authTokenAdapter.remove(revokedPayload);
        await scope().service.authorization.cleanupExpired();
        for (const token of [expired, revoked]) {
          assert.ok(await scope().model.authorization.getById(token.id));
          await expectOAuth(
            () => scope().service.authorization.lookupContext(token.accessToken, token.resource),
            'invalid_token',
          );
        }
        const page = await scope().service.accessToken.mine(owner.id, siteResource(), {
          pageNo: 1,
          pageSize: 20,
        });
        assert.equal(page.total, '2');
        assert.deepEqual(
          page.list.map(row => [String(row.id), row.status]),
          [
            [String(revoked.id), 'revoked'],
            [String(expired.id), 'expired'],
          ],
        );
        for (const row of page.list)
          assert.deepEqual(Object.keys(row).sort(), safeColumns.toSorted());
      });
    });
  });

  it('rejects personal refresh and reissue even with a refresh-purpose signature without mutating the row', async () => {
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      const token = await create(fixture, owner);
      const clientId = await client(fixture);
      await context(async () => {
        const before = await scope().model.authorization.getById(token.id);
        assert.ok(before);
        const verified = await app.bean.jwt.get('mcpAccess').verify(token.accessToken);
        assert.ok(verified);
        const payload = scope().service.authTokenAdapter.payload(verified);
        const crafted = await app.bean.jwt.get('mcpRefresh').sign(payload);
        for (const credential of [token.accessToken, crafted]) {
          await expectOAuth(
            () =>
              scope().service.authorization.exchange(
                new URLSearchParams({
                  grant_type: 'refresh_token',
                  client_id: clientId,
                  refresh_token: credential,
                  resource: token.resource,
                }),
                undefined,
              ),
            'invalid_grant',
          );
        }
        const adapter = scope().service.authTokenAdapter;
        assert.equal(
          await adapter.verify(payload, {
            operation: 'refresh',
            clientName: 'mcpRefresh',
            input: { clientId, resource: token.resource },
          }),
          false,
        );
        assert.throws(
          () => adapter.getJwtOptions(payload),
          error => error instanceof OAuthError && error.oauthError === 'invalid_grant',
        );
        await expectOAuth(
          () => adapter.create(payload, undefined, { clientId, resource: token.resource }),
          'invalid_grant',
        );
        await expectOAuth(() => adapter.refresh(), 'invalid_grant');
        assert.deepEqual(await scope().model.authorization.getById(token.id), before);
        await scope().service.authorization.lookupContext(token.accessToken, token.resource);
      });
    });
  });

  it('captures an owned custom snapshot, enforces exact tool access and invalidates tokens on rename or deletion', async () => {
    if (!app.meta.modules['training-student']) return;
    await withFixture(async fixture => {
      const [owner] = fixture.users;
      const resource = `${getMcpIssuer(app)}/admin`;
      await context(async () => {
        const role = await app.scope('home-user').model.role.insert({
          name: `mcp-personal-admin-${randomUUID()}`,
          title: 'Owned Student personal token Admin admission',
          siteIds: ['admin'],
          builtin: false,
          mcpAccess: true,
        });
        fixture.roleIds.push(role.id);
        const roles = await app.bean.role.findAllByUserId(owner.id);
        await app.bean.role.replaceUserRoleIds(owner.id, [
          ...(roles ?? []).map(role => role.id),
          role.id,
        ]);
      });
      const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
        if (
          String(app.bean.passport.currentUser?.id) !== String(owner.id) ||
          request.action.controllerBeanFullName !== 'training-student.controller.student'
        ) {
          return next();
        }
        return {
          allowed: ['select', 'view', 'create'].some(
            action => request.policyActionKey === `training-student.controller.student#${action}`,
          ),
          actionKey: request.action.actionKey,
          action: request.action,
          ...(request.action.options.dataScope
            ? { terms: [{ dataScope: 'mine' as const, ownerId: String(owner.id) }] }
            : {}),
        };
      });
      try {
        const owned = await asUser(owner, async () => {
          const catalog = await scope().service.customScope.catalog(resource);
          const selected = catalog.find(tool => tool.name === 'training-student_student_select');
          assert.ok(selected);
          const tools = [
            { name: selected.name, controller: selected.controller, action: selected.action },
          ];
          const definition = await scope().service.customScope.createMine(owner.id, resource, {
            name: 'Personal_exact',
            description: '',
            tools,
          });
          fixture.scopeIds.push(definition.id);
          return definition;
        });
        const token = await create(
          fixture,
          owner,
          { name: 'Exact tools', scope: owned.scope },
          resource,
        );
        await context(async () => {
          const row = await scope().model.authorization.getById(token.id);
          assert.deepEqual(row?.scopeTools, owned.tools);
          await scope().service.authorization.lookupContext(token.accessToken, token.resource);
          assert.deepEqual(
            (await scope().service.authorization.resolveToolAccess(owner.id, resource, owned.scope))
              .tools,
            owned.tools,
          );
          const server = await app
            .scope('cabloy-mcp')
            .service.sharedBusinessTools.createServer(resource, owned.scope);
          try {
            assert.deepEqual(
              (await server.catalog()).map(tool => tool.name),
              owned.tools.map(tool => tool.name),
            );
            const rpc = await connect(server);
            const allowed = await rpc.request('tools/call', {
              name: owned.tools[0].name,
              arguments: {},
            });
            assert.equal(allowed.error, undefined);
            assert.notEqual(allowed.result?.isError, true);
            const denied = await rpc.request('tools/call', {
              name: 'training-student_student_create',
              arguments: {},
            });
            assert.equal(denied.error?.code, -32602);
          } finally {
            await server.close();
          }
        });
        const renamed = await asUser(owner, () =>
          scope().service.customScope.updateMine(owner.id, resource, owned.id, {
            name: 'Personal_renamed',
            description: '',
            tools: owned.tools,
          }),
        );
        await context(async () => {
          assert.equal((await scope().model.authorization.getById(token.id))?.state, 'revoked');
          await expectOAuth(
            () => scope().service.authorization.lookupContext(token.accessToken, token.resource),
            'invalid_token',
          );
        });
        const replacement = await create(
          fixture,
          owner,
          {
            name: 'Renamed scope',
            scope: renamed.scope,
          },
          resource,
        );
        await asUser(owner, () =>
          scope().service.customScope.deleteMine(owner.id, resource, owned.id),
        );
        await context(async () => {
          assert.equal(
            (await scope().model.authorization.getById(replacement.id))?.state,
            'revoked',
          );
          await expectOAuth(
            () =>
              scope().service.authorization.lookupContext(
                replacement.accessToken,
                replacement.resource,
              ),
            'invalid_token',
          );
        });
      } finally {
        off();
      }
    });
  });
});
