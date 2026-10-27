import type { IJwtToken, IPayloadData } from 'vona-module-a-jwt';
import type { IAuthTokenConfig, TypeAuthTokenMode } from 'vona-module-a-user';

import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';
import { $getAuthTokenMode, $parseAuthTokenMode } from 'vona-module-a-user';

interface ITestPayloadData extends IPayloadData {
  token: string;
}

interface IFixture {
  userId: string;
  authId: string;
  name: string;
}

const unauthorized = (error: { code?: number }) => error.code === 401;

describe('passportSession.test.ts', { concurrency: false }, () => {
  it('defaults to auth and rejects invalid modes, stateless sessions and reissue refresh', async () => {
    assert.equal($parseAuthTokenMode(undefined), 'auth');
    for (const mode of ['auth', 'session'] as const) {
      assert.equal($parseAuthTokenMode(mode), mode);
    }
    for (const value of ['', 'Session', 'all', null, true, 1]) {
      assert.throws(() => $parseAuthTokenMode(value), /auth or session/);
    }
    await withMode(undefined, async () => {
      const config = app.ctx.config.modules['a-user'].authToken;
      assert.equal($getAuthTokenMode(config), 'auth');
      assert.equal(app.bean.passport.authTokenMode, 'auth');
    });
    await withMode('session', async () => {
      const config = app.ctx.config.modules['a-user'].authToken;
      assert.equal($getAuthTokenMode(config), 'session');
      assert.equal(app.bean.passport.authTokenMode, 'session');
      assert.throws(() => $getAuthTokenMode({ ...config, stateless: true }), /stateful/);
      assert.throws(
        () =>
          $getAuthTokenMode({
            ...config,
            strategy: { ...config.strategy, refreshAuthToken: 'reissue' },
          }),
        /reissue/,
      );
    });
    await withMode(
      'session',
      async () => {
        assert.throws(() => app.bean.passport.authTokenMode, /stateful/);
      },
      { stateless: true },
    );
    await withMode(
      'session',
      async () => {
        assert.throws(() => app.bean.passport.authTokenMode, /reissue/);
      },
      { strategy: { signin: 'refresh', refreshAuthToken: 'reissue' } },
    );
  });

  it('auth mode keeps the shared credential token and logout revokes both logins', async () => {
    await withFixture(async fixture => {
      const a = await login('auth', fixture);
      const b = await login('auth', fixture);
      const payloadA = await verify('auth', a.accessToken);
      const payloadB = await verify('auth', b.accessToken);
      assert.equal(payloadA.token, payloadB.token);
      await logout('auth', a.accessToken);
      await rejectedPair('auth', a);
      await rejectedPair('auth', b);
    });
  });

  it('session logins are independent; refresh, reuse and derived tokens retain their session', async () => {
    await withFixture(async fixture => {
      const a = await login('session', fixture);
      const b = await login('session', fixture);
      const payloadA = await verify('session', a.accessToken);
      const payloadB = await verify('session', b.accessToken);
      assert.match(
        payloadA.token,
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      assert.notEqual(payloadA.token, payloadB.token);
      await withMode('session', async () => {
        const cache = app.scope('a-user').cacheRedis.authToken;
        assert.equal(
          await cache.get(`${fixture.userId}:${fixture.authId}:${payloadA.token}`),
          payloadA.token,
        );
        assert.equal(
          await cache.get(`${fixture.userId}:${fixture.authId}:${payloadB.token}`),
          payloadB.token,
        );
      });
      let refreshed = a;
      for (const strategy of ['refresh', 'reuse'] as const) {
        refreshed = await withMode(
          'session',
          async () => {
            const jwt = await app.bean.passport.refreshAuthToken(refreshed.refreshToken);
            assert.equal(
              (app.ctx.state.passportPayloadData as ITestPayloadData | undefined)?.token,
              payloadA.token,
            );
            return jwt;
          },
          { strategy: { signin: 'refresh', refreshAuthToken: strategy } },
        );
        assert.equal((await verify('session', refreshed.accessToken)).token, payloadA.token);
        assert.equal(
          (await verify('session', refreshed.refreshToken, 'refresh')).token,
          payloadA.token,
        );
      }
      const derived: [string, 'access' | 'oauth' | 'code'][] = [];
      for (const create of [
        () => app.bean.passport.createTempAuthToken(),
        () => app.bean.passport.createOauthAuthToken(),
        () => app.bean.passport.createOauthCode(),
        () => app.bean.passport.createOauthCodeFromOauthAuthToken(a.accessToken),
      ]) {
        const token = await withMode('session', async () => {
          await app.bean.passport.checkAuthToken(a.accessToken);
          return await create();
        });
        derived.push([
          token,
          derived.length === 1 ? 'oauth' : derived.length >= 2 ? 'code' : 'access',
        ]);
      }
      for (const [token, client] of derived) {
        assert.equal((await verify('session', token, client)).token, payloadA.token);
      }
      const exchanged = await withMode('session', () =>
        app.bean.passport.createAuthTokenFromOauthCode(derived[2][0]),
      );
      assert.equal((await verify('session', exchanged.accessToken)).token, payloadA.token);
      await logout('session', refreshed.accessToken);
      await rejectedPair('session', a);
      await rejectedPair('session', refreshed);
      await rejectedPair('session', exchanged);
      for (const [token, client] of derived) {
        await withMode('session', () =>
          assert.rejects(() => app.bean.passport.checkAuthToken(token, client), unauthorized),
        );
      }
      await withMode('session', () =>
        assert.rejects(
          () => app.bean.passport.createAuthTokenFromOauthCode(derived[2][0]),
          unauthorized,
        ),
      );
      await withMode('session', () =>
        assert.rejects(
          () => app.bean.passport.createOauthCodeFromOauthAuthToken(a.accessToken),
          unauthorized,
        ),
      );
      await verify('session', b.accessToken);
      await verify('session', b.refreshToken, 'refresh');
    });
  });

  it('logout at the refresh boundary cannot resurrect a deleted session', async () => {
    await withFixture(async fixture => {
      const a = await login('session', fixture);
      const b = await login('session', fixture);
      const refreshed = await withMode('session', async () => {
        const redisToken = app.scope('a-user').service.redisToken;
        const refresh = redisToken.refresh.bind(redisToken);
        const boundary = mock.method(
          redisToken,
          'refresh',
          async (payload: IPayloadData, ttl?: number) => {
            // A separate request deletes the record after verification, before TTL extension.
            await logout('session', a.accessToken);
            await refresh(payload, ttl);
          },
        );
        try {
          const jwt = await app.bean.passport.refreshAuthToken(a.refreshToken);
          assert.equal(boundary.mock.callCount(), 1);
          return jwt;
        } finally {
          boundary.mock.restore();
        }
      });
      await rejectedPair('session', a);
      await rejectedPair('session', refreshed);
      await verify('session', b.accessToken);
      await verify('session', b.refreshToken, 'refresh');
    });
  });

  it('requires verified payload state for session signout and rejects effective stateless overrides', async () => {
    await withFixture(async fixture => {
      const jwt = await login('session', fixture);
      await withMode('session', async () => {
        const verified = await app.bean.passport.checkAuthToken(jwt.accessToken);
        assert.ok(verified);
        assert.equal(app.ctx.state.passportPayloadData, verified.payloadData);
        await app.bean.passport.setCurrent(verified.passport);
        assert.equal(app.ctx.state.passportPayloadData, undefined);
        await assert.rejects(() => app.bean.passport.signout(), unauthorized);
      });
      await verify('session', jwt.accessToken);
      await withMode('session', async () => {
        const verified = await app.bean.passport.checkAuthToken(jwt.accessToken);
        assert.ok(verified);
        await assert.rejects(
          () => app.bean.passport.signin(verified.passport, { authToken: { stateless: true } }),
          /stateful/,
        );
      });
      await withMode('session', () =>
        assert.rejects(
          () =>
            app.bean.auth.authenticate('auth-simple:simple', {
              clientName: 'default',
              state: { intention: 'login' },
              clientOptions: {
                username: fixture.name,
                password: 'initial-password',
                authTokenOptions: { stateless: true },
              },
            }),
          /stateful/,
        ),
      );
    });
  });

  it('kickOut removes all user token shapes independently of mode without prefix collisions', async () => {
    await withFixture(async fixture => {
      const a = await login('session', fixture);
      const b = await login('session', fixture);
      const auth = await login('auth', fixture);
      const keys = [
        `${fixture.userId}:owned-auth`,
        `${fixture.userId}:owned-auth:owned-session`,
        `${fixture.userId}0:owned-auth:neighbor`,
      ];
      try {
        await withMode('session', async () => {
          const cache = app.scope('a-user').cacheRedis.authToken;
          for (const key of keys) await cache.set('owned-token', key);
        });
        await withMode('auth', async () => {
          const user = await app.bean.user.findOneById(fixture.userId);
          assert.ok(user);
          await app.bean.passport.kickOut(user);
        });
        await rejectedPair('session', a);
        await rejectedPair('session', b);
        await rejectedPair('auth', auth);
        await withMode('session', async () => {
          const cache = app.scope('a-user').cacheRedis.authToken;
          assert.equal(await cache.get(keys[0]), undefined);
          assert.equal(await cache.get(keys[1]), undefined);
          assert.equal(await cache.get(keys[2]), 'owned-token');
        });
      } finally {
        await withMode('session', async () => {
          for (const key of keys) await app.scope('a-user').cacheRedis.authToken.del(key);
        });
      }
    });
  });
});

async function withMode<T>(
  mode: TypeAuthTokenMode | undefined,
  callback: () => Promise<T>,
  overrides: Partial<IAuthTokenConfig> = {},
): Promise<T> {
  return await app.bean.executor.mockCtx(async () => {
    const config = app.ctx.config;
    Object.defineProperty(app.ctx, 'config', {
      configurable: true,
      value: {
        ...config,
        modules: {
          ...config.modules,
          'a-user': {
            ...config.modules['a-user'],
            authToken: { ...config.modules['a-user'].authToken, mode, ...overrides },
          },
        },
      },
    });
    return await callback();
  });
}

async function login(mode: TypeAuthTokenMode, fixture: IFixture): Promise<IJwtToken> {
  return await withMode(mode, async () => {
    const jwt = await app.bean.auth.authenticate('auth-simple:simple', {
      clientName: 'default',
      state: { intention: 'login' },
      clientOptions: { username: fixture.name, password: 'initial-password' },
    });
    assert.ok(jwt);
    assert.ok((app.ctx.state.passportPayloadData as ITestPayloadData | undefined)?.token);
    return jwt;
  });
}

async function verify(
  mode: TypeAuthTokenMode,
  token: string,
  client: 'access' | 'refresh' | 'oauth' | 'code' = 'access',
): Promise<ITestPayloadData> {
  return await withMode(mode, async () => {
    const verified = await app.bean.passport.checkAuthToken(token, client);
    assert.ok(verified);
    assert.equal(app.ctx.state.passportPayloadData, verified.payloadData);
    return verified.payloadData as ITestPayloadData;
  });
}

async function rejectedPair(mode: TypeAuthTokenMode, jwt: IJwtToken) {
  await withMode(mode, () =>
    assert.rejects(() => app.bean.passport.checkAuthToken(jwt.accessToken), unauthorized),
  );
  await withMode(mode, () =>
    assert.rejects(() => app.bean.passport.refreshAuthToken(jwt.refreshToken), unauthorized),
  );
}

async function logout(mode: TypeAuthTokenMode, accessToken: string) {
  await withMode(mode, async () => {
    await app.bean.passport.checkAuthToken(accessToken);
    await app.bean.passport.signout();
    assert.equal(app.ctx.state.passportPayloadData, undefined);
    assert.equal(app.bean.passport.current, undefined);
  });
}

async function withFixture(callback: (fixture: IFixture) => Promise<void>) {
  let userId: string | undefined;
  let authSimpleId: string | undefined;
  try {
    const fixture = await app.bean.executor.mockCtx(async () => {
      const name = `passport-session-${crypto.randomUUID()}`;
      const user = await app.bean.user.register({ name }, true);
      userId = user.id.toString();
      const authSimple = await app
        .scope('auth-simple')
        .service.authSimple.createForUser(user.id, 'initial-password');
      assert.ok(authSimple);
      authSimpleId = authSimple.id.toString();
      const provider = await app.bean.authProvider.get({
        providerName: 'auth-simple:simple',
        clientName: 'default',
      });
      const auth = await app
        .scope('a-auth')
        .model.auth.get({ userId: user.id, authProviderId: provider.id });
      assert.ok(auth);
      return { userId, authId: auth.id.toString(), name };
    });
    await callback(fixture);
  } finally {
    if (userId) {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(userId!);
        if (user) await app.bean.passport.kickOut(user);
        await app.scope('a-auth').model.auth.delete({ userId });
        if (authSimpleId) await app.scope('auth-simple').model.authSimple.deleteById(authSimpleId);
        await app.scope('home-user').model.roleUser.delete({ userId });
        await app.bean.user.removeById(userId!);
      });
    }
  }
}
