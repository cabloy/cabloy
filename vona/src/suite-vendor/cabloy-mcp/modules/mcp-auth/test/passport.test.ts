import type { TestContext } from 'node:test';
import type { IPayloadData } from 'vona-module-a-jwt';
import type { IAuthTokenAdapter, IPassport } from 'vona-module-a-user';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

function createPassport(): IPassport {
  return {
    user: {
      id: 'passport-response-user',
      name: 'Passport response fixture',
      displayName: 'Passport display name',
      activated: true,
      accountStatus: 'active',
      instanceId: 'untrusted-user-instance',
    },
    auth: { id: 'passport-response-auth', instanceId: 'untrusted-auth-instance' },
    roles: [],
  } as IPassport;
}

interface IScopedPayload extends IPayloadData {
  userId: string;
  authId: string;
  token: string;
  generation: number;
}

function hasCode(code: number) {
  return (error: { code?: number }) => error.code === code;
}

function mockSelectedAuthTokenAdapter(
  t: TestContext,
  passport: IPassport,
  mode: 'auth' | 'session' = 'auth',
) {
  const config = app.ctx.config;
  // Request-local policy only: never alter the shared provider/JWT configuration.
  Object.defineProperty(app.ctx, 'config', {
    configurable: true,
    value: {
      ...config,
      modules: {
        ...config.modules,
        'a-user': {
          ...config.modules['a-user'],
          authToken: { ...config.modules['a-user'].authToken, mode, stateless: mode === 'auth' },
        },
      },
    },
  });
  passport.auth!.authProviderId = 123;
  const adapter = app.scope('mcp-auth').service.authTokenAdapter as Required<IAuthTokenAdapter>;
  assert.equal(
    config.modules['a-jwt'].clients.mcpAccess?.authTokenAdapter,
    'mcp-auth:authTokenAdapter',
  );
  assert.equal(
    config.modules['a-jwt'].clients.mcpRefresh?.authTokenAdapter,
    'mcp-auth:authTokenAdapter',
  );
  assert.equal(config.modules['a-jwt'].clients.code.authTokenAdapter, undefined);
  assert.deepEqual(adapter.options, { stateless: false, strategy: 'reissue' });
  let current: IScopedPayload | undefined;
  const operations: string[] = [];
  const create = t.mock.method(
    adapter,
    'create',
    async (...[payloadData]: Parameters<IAuthTokenAdapter['create']>) => {
      operations.push('create');
      const payload = payloadData as IScopedPayload;
      if (payload.generation === undefined) {
        current = { ...payload, token: 'scoped-token', generation: 0 };
      } else {
        if (
          !current ||
          payload.token !== current.token ||
          payload.generation !== current.generation
        ) {
          return app.throw(401);
        }
        current = { ...payload, generation: current.generation + 1 };
      }
      return current;
    },
  );
  t.mock.method(adapter, 'retrieve', async () => current);
  const verify = t.mock.method(
    adapter,
    'verify',
    async (...[payloadData, options]: Parameters<IAuthTokenAdapter['verify']>) => {
      operations.push(options!.operation);
      const payload = payloadData as IScopedPayload;
      return (
        !!current &&
        options?.clientName === (options?.operation === 'refresh' ? 'mcpRefresh' : 'mcpAccess') &&
        payload.token === current.token &&
        (options?.operation === 'refresh' || payload.generation === current.generation)
      );
    },
  );
  const refresh = t.mock.method(adapter, 'refresh', async () => {
    throw new Error('Scoped refresh must use reissue/create');
  });
  t.mock.method(adapter, 'remove', async () => {
    current = undefined;
  });
  const deserialize = t.mock.method(adapter, 'deserialize', async () => passport);
  t.mock.method(adapter, 'getJwtOptions', () => ({
    accessClient: 'mcpAccess',
    refreshClient: 'mcpRefresh',
    accessExpiresIn: 37,
    refreshExpiresIn: 91,
  }));
  const provider = t.mock.method(app.bean.authProvider, 'getClientOptions', async () => ({
    clientOptions: { authTokenOptions: { stateless: true } },
  }));
  return { operations, create, verify, refresh, deserialize, provider };
}

describe('passport.test.ts', { concurrency: false }, () => {
  it('registered JWT clients preserve identity, JWT lifetimes and scoped current state', async t => {
    assert.ok(app.meta.modules['mcp-auth']);
    await app.bean.executor.mockCtx(async () => {
      const passport = createPassport();
      const { operations, create, verify, provider } = mockSelectedAuthTokenAdapter(t, passport);
      const bean = app.bean.passport;
      const signin = t.mock.method(app.scope('a-user').event.signin, 'emit', async () => {});
      const ordinaryPassport = createPassport();
      const ordinaryPayload = {
        userId: ordinaryPassport.user!.id,
        authId: ordinaryPassport.auth!.id,
        token: 'ordinary-token',
      };
      ordinaryPassport.auth!.authProviderId = 456;
      const ordinaryDeserialize = t.mock.method(
        app.scope('home-user').service.passportAdapter,
        'deserialize',
        async () => ordinaryPassport,
      );
      const ordinaryCode = await app.bean.jwt.createOauthCode(ordinaryPayload);
      const ordinaryPair = await app.bean.jwt.create(ordinaryPayload);
      // Prove the ordinary code is valid before using it to exercise the preattachment gate.
      assert.ok(await bean.checkAuthToken(ordinaryCode, 'code', { operation: 'refresh' }));
      assert.equal(ordinaryDeserialize.mock.callCount(), 1);
      assert.equal(bean.current, undefined);
      const input = { resource: 'fixture-resource' };
      const token = await bean.createAuthToken(
        passport,
        { userId: 'override-user', authId: 'override-auth' } as IPayloadData,
        'mcpAccess',
        input,
      );
      assert.equal(create.mock.calls[0].arguments[2], input);
      assert.equal(token.expiresIn, 37);
      for (const [value, client, ttl] of [
        [token.accessToken, 'mcpAccess', 37],
        [token.refreshToken, 'mcpRefresh', 91],
      ] as const) {
        const decoded = app.bean.jwt.get(client).instance.decode(value) as {
          iat: number;
          exp: number;
        };
        assert.equal(decoded.exp - decoded.iat, ttl);
      }
      assert.equal(signin.mock.callCount(), 0);
      assert.equal(bean.current, passport);
      assert.equal(app.ctx.state.passportAuthTokenClient, 'mcpAccess');
      assert.equal((app.ctx.state.passportPayloadData as IScopedPayload).generation, 0);
      // Signin and OAuth helpers must reject before setCurrent/checkAuthToken can erase provenance.
      for (const convert of [
        () => bean.signin(ordinaryPassport),
        () => bean.createAuthToken(ordinaryPassport, {}),
        () => bean.createTempAuthToken(),
        () => bean.createOauthAuthToken(),
        () => bean.createOauthCode(),
        () => bean.createOauthCodeFromOauthAuthToken(ordinaryPair.accessToken),
        () => bean.createAuthTokenFromOauthCode(ordinaryCode),
        () => bean.refreshAuthToken(ordinaryPair.refreshToken),
      ]) {
        await assert.rejects(convert, hasCode(403));
        assert.equal(bean.current, passport);
        assert.equal(app.ctx.state.passportAuthTokenClient, 'mcpAccess');
      }
      assert.equal(signin.mock.callCount(), 0);
      assert.equal(ordinaryDeserialize.mock.callCount(), 1);
      await bean.setCurrent(undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      assert.equal(app.ctx.state.passportPayloadData, undefined);
      await assert.rejects(() => bean.checkAuthToken(token.accessToken), hasCode(401));
      await assert.rejects(() => bean.refreshAuthToken(token.refreshToken), hasCode(401));
      const checked = await bean.checkAuthToken(token.accessToken, 'mcpAccess', { input });
      assert.ok(checked);
      const payload = checked.payloadData as IScopedPayload;
      assert.equal(payload.userId, passport.user!.id);
      assert.equal(payload.authId, passport.auth!.id);
      assert.equal(payload.token, 'scoped-token');
      assert.deepEqual(operations, ['create', 'check']);
      assert.deepEqual(verify.mock.calls[0].arguments[1], {
        operation: 'check',
        clientName: 'mcpAccess',
        input,
      });
      assert.equal(app.ctx.state.passportAuthTokenClient, 'mcpAccess');
      assert.equal(provider.mock.callCount(), 1); // Only the independently valid ordinary code uses provider policy.
      await bean.signout();
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      await assert.rejects(() => bean.checkAuthToken(token.accessToken, 'mcpAccess'), hasCode(401));
      assert.equal(bean.current, undefined);
    });
  });

  it('selected adapter refresh reissues through create and attaches only after successful issuance', async t => {
    assert.ok(app.meta.modules['mcp-auth']);
    await app.bean.executor.mockCtx(async () => {
      const passport = createPassport();
      const { operations, create, verify, refresh, deserialize, provider } =
        mockSelectedAuthTokenAdapter(t, passport);
      const bean = app.bean.passport;
      const initial = await bean.createAuthToken(passport, {}, 'mcpAccess');
      assert.deepEqual(operations, ['create']);
      await bean.setCurrent(undefined);
      const input = { scope: 'fixture-narrower-scope' };
      const checked = await bean.checkAuthToken(initial.refreshToken, 'mcpRefresh', {
        operation: 'refresh',
        input,
      });
      assert.ok(checked);
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      assert.equal(app.ctx.state.passportPayloadData, undefined);
      const rotated = await bean.refreshAuthToken(initial.refreshToken, 'mcpRefresh', input);
      assert.equal((app.ctx.state.passportPayloadData as IScopedPayload).generation, 1);
      assert.equal(bean.current, passport);
      assert.equal(app.ctx.state.passportAuthTokenClient, 'mcpAccess');
      assert.deepEqual(operations, ['create', 'refresh', 'refresh', 'create']);
      assert.deepEqual(verify.mock.calls[1].arguments[1], {
        operation: 'refresh',
        clientName: 'mcpRefresh',
        input,
      });
      assert.equal(create.mock.calls[1].arguments[2], input);
      assert.equal(refresh.mock.callCount(), 0);
      await bean.setCurrent(undefined);
      // Read-only verification accepts the old generation; reissue/create must still reject it.
      await assert.rejects(
        () => bean.refreshAuthToken(initial.refreshToken, 'mcpRefresh'),
        hasCode(401),
      );
      assert.deepEqual(operations, ['create', 'refresh', 'refresh', 'create', 'refresh', 'create']);
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      assert.equal(app.ctx.state.passportPayloadData, undefined);
      create.mock.mockImplementation(async () => app.throw(401));
      const count = create.mock.callCount();
      await assert.rejects(
        () => bean.refreshAuthToken(rotated.refreshToken, 'mcpRefresh', input),
        hasCode(401),
      );
      assert.equal(create.mock.callCount(), count + 1);
      const [payload, , createInput] = create.mock.calls[count].arguments;
      assert.equal((payload as IScopedPayload).generation, 1);
      assert.equal(createInput, input);
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      assert.equal(app.ctx.state.passportPayloadData, undefined);
      await assert.rejects(
        () => bean.createAuthToken(passport, {}, 'mcpAccess', input),
        hasCode(401),
      );
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      assert.equal(app.ctx.state.passportPayloadData, undefined);
      await assert.rejects(
        () => bean.refreshAuthToken(rotated.accessToken, 'mcpRefresh'),
        hasCode(401),
      );
      await assert.rejects(
        () => bean.checkAuthToken(initial.accessToken, 'mcpAccess'),
        hasCode(401),
      );
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      await bean.checkAuthToken(rotated.accessToken, 'mcpAccess');
      assert.equal(bean.current, passport);
      await bean.setCurrent(undefined);
      const disabled = createPassport();
      disabled.user!.accountStatus = 'disabled';
      deserialize.mock.mockImplementation(async () => disabled);
      await assert.rejects(
        () => bean.checkAuthToken(rotated.accessToken, 'mcpAccess'),
        hasCode(403),
      );
      assert.equal(bean.current, undefined);
      assert.equal(app.ctx.state.passportAuthTokenClient, undefined);
      assert.equal(provider.mock.callCount(), 0);
    });
  });

  it('selected adapter refresh reissues independently of ordinary session mode', async t => {
    assert.ok(app.meta.modules['mcp-auth']);
    await app.bean.executor.mockCtx(async () => {
      const passport = createPassport();
      const { operations, provider } = mockSelectedAuthTokenAdapter(t, passport, 'session');
      const bean = app.bean.passport;
      assert.equal(bean.authTokenMode, 'session');
      const initial = await bean.createAuthToken(passport, {}, 'mcpAccess');
      await bean.setCurrent(undefined);
      const rotated = await bean.refreshAuthToken(initial.refreshToken, 'mcpRefresh');
      assert.equal((app.ctx.state.passportPayloadData as IScopedPayload).generation, 1);
      assert.equal(bean.current, passport);
      assert.equal(app.ctx.state.passportAuthTokenClient, 'mcpAccess');
      assert.deepEqual(operations, ['create', 'refresh', 'create']);
      await bean.setCurrent(undefined);
      const checked = await bean.checkAuthToken(rotated.accessToken, 'mcpAccess');
      assert.ok(checked);
      assert.equal((checked.payloadData as IScopedPayload).generation, 1);
      assert.deepEqual(operations, ['create', 'refresh', 'create', 'check']);
      assert.equal(provider.mock.callCount(), 0);
    });
  });
});
