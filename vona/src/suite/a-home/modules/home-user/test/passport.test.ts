import type { TestContext } from 'node:test';
import type { SchemaObject } from 'openapi3-ts/oas31';
import type { IPayloadData } from 'vona-module-a-jwt';
import type { IAuthTokenAdapter, IAuthUserProfile, IPassport } from 'vona-module-a-user';

import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

import { ControllerPassport } from '../src/controller/passport.ts';

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

const jwt = {
  accessToken: 'passport-response-access',
  refreshToken: 'passport-response-refresh',
};

describe('passport.test.ts', { concurrency: false }, () => {
  it('registered JWT clients preserve identity, JWT lifetimes and scoped current state', async t => {
    if (!app.meta.modules['mcp-auth']) return t.skip('mcp-auth is not installed');
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
    if (!app.meta.modules['mcp-auth']) return t.skip('mcp-auth is not installed');
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
    if (!app.meta.modules['mcp-auth']) return t.skip('mcp-auth is not installed');
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

  it('current returns the authoritative request instance, not persisted passport identities', async () => {
    await app.bean.executor.mockCtx(async () => {
      const passport = createPassport();
      app.ctx.state.passport = passport;
      const instanceId = app.ctx.instance.id;
      assert.notEqual(instanceId, undefined);

      const result = await app.bean._getBean(ControllerPassport).current();
      assert.ok(result);
      assert.equal(result.instanceId, instanceId);
      assert.equal(result.user.id, passport.user!.id);
      assert.equal(result.user.name, passport.user!.name);
      assert.equal(result.user.displayName, passport.user!.displayName);
      assert.equal(result.auth, passport.auth);
      assert.equal(result.roles, passport.roles);
      assert.equal('instanceId' in result.user, false);
    });
  });

  it('current leaves an absent displayName unset instead of falling back to the username', async () => {
    await app.bean.executor.mockCtx(async () => {
      const passport = createPassport();
      delete passport.user!.displayName;
      app.ctx.state.passport = passport;
      const result = await app.bean._getBean(ControllerPassport).current();
      assert.ok(result);
      assert.equal(result.user.name, passport.user!.name);
      assert.equal(result.user.displayName, undefined);
    });
  });

  it('current returns explicit null when the request has no instance', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        app.ctx.state.passport = createPassport();
        assert.equal(app.ctx.instance, undefined);
        const result = await app.bean._getBean(ControllerPassport).current();
        assert.ok(result);
        assert.equal(result.instanceId, null);
        assert.ok(Object.hasOwn(result, 'instanceId'));
      },
      { instanceName: null },
    );
  });

  it('current preserves the absent-passport and incomplete-passport behavior', async () => {
    await app.bean.executor.mockCtx(async () => {
      const controller = app.bean._getBean(ControllerPassport);
      for (const passport of [undefined, {}, { user: createPassport().user }, { auth: jwt }]) {
        app.ctx.state.passport = passport as IPassport | undefined;
        assert.equal(await controller.current(), undefined);
      }
    });
  });

  it('every Passport/JWT response uses the same authoritative instance projection', async () => {
    for (const instanceName of ['', null] as const) {
      await app.bean.executor.mockCtx(
        async () => {
          app.ctx.state.passport = createPassport();
          const controller = app.bean._getBean(ControllerPassport);
          const authenticate = mock.method(app.bean.auth, 'authenticate', async () => jwt);
          const fromOauthCode = mock.method(
            app.bean.passport,
            'createAuthTokenFromOauthCode',
            async () => jwt,
          );
          try {
            const login = { username: 'response-user', password: 'response-password', captcha: {} };
            const responses = [
              await controller.login(login as Parameters<ControllerPassport['login']>[0]),
              await controller.register({
                ...login,
                email: 'response@example.com',
                passwordConfirm: login.password,
                consumerUrl: 'http://localhost/account/activation',
              } as Parameters<ControllerPassport['register']>[0]),
              await controller.associate('auth-simple', 'simple', 'default'),
              await controller.migrate('auth-simple', 'simple', 'default'),
              await controller.createPassportJwtFromOauthCode('response-code'),
            ];
            for (const response of responses) {
              assert.equal(response.passport.instanceId, app.ctx.instance?.id ?? null);
              assert.ok(Object.hasOwn(response.passport, 'instanceId'));
              assert.equal(response.passport.user.id, 'passport-response-user');
              assert.equal(response.passport.user.displayName, 'Passport display name');
              assert.equal(response.passport.user.name, 'Passport response fixture');
              assert.equal(response.jwt, jwt);
            }
            assert.equal(authenticate.mock.callCount(), 4);
            assert.equal(fromOauthCode.mock.callCount(), 1);
          } finally {
            fromOauthCode.mock.restore();
            authenticate.mock.restore();
          }
        },
        { instanceName },
      );
    }
  });

  it('userOfProfile maps only an actual trimmed provider displayName without name fallbacks', async () => {
    const profile: IAuthUserProfile = {
      id: 'display-name-profile',
      username: 'provider-username',
      name: { givenName: 'Given', familyName: 'Family' },
      emails: [{ value: 'profile@example.test' }],
      photos: [{ value: 'https://example.test/avatar.png' }],
    };
    for (const displayName of [undefined, '', ' \t ', '  Provider display name  ']) {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.scope('home-user').service.userAdapter.userOfProfile({
          ...profile,
          ...(displayName === undefined ? {} : { displayName }),
        });
        assert.equal(user.name, profile.username);
        assert.equal(user.displayName, displayName?.trim() || undefined);
        assert.equal(user.email, profile.emails![0].value);
        assert.equal(user.avatar, profile.photos![0].value);
      });
    }
  });

  it('OAuth creation maps displayName but existing login and linking preserve account profile fields', async () => {
    const suffix = crypto.randomUUID();
    const oauthName = `display-oauth-${suffix}`;
    const linkedName = `display-linked-${suffix}`;
    const profileId = `display-profile-${suffix}`;
    const linkedProfileId = `display-link-${suffix}`;
    const profile: IAuthUserProfile = {
      id: profileId,
      username: oauthName,
      displayName: '  Initial provider display  ',
      confirmed: true,
    };
    let oauthUserId: string | undefined;
    let linkedUserId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const provider = await app.bean.authProvider.get({
          providerName: 'auth-oauth:oauth',
          clientName: 'github',
        });
        const passport = await app
          .scope('a-auth')
          .service.auth.issuePassport(profile, provider, {});
        assert.ok(passport.user);
        oauthUserId = passport.user.id.toString();
        assert.equal(passport.user.name, oauthName);
        assert.equal(passport.user.displayName, 'Initial provider display');
        await app.bean.user.updateById(oauthUserId, { displayName: 'Account-owned display' });
      });

      await app.bean.executor.mockCtx(async () => {
        const provider = await app.bean.authProvider.get({
          providerName: 'auth-oauth:oauth',
          clientName: 'github',
        });
        const passport = await app.scope('a-auth').service.auth.issuePassport(
          { ...profile, username: `${oauthName}-changed`, displayName: 'Changed provider display' },
          provider,
          {},
          {
            intention: 'login',
            authProviderId: provider.id,
            instanceName: app.ctx.instanceName!,
            locale: app.ctx.locale,
            tz: app.ctx.tz,
          },
        );
        assert.equal(passport.user?.id.toString(), oauthUserId);
        assert.equal(passport.user?.name, oauthName);
        assert.equal(passport.user?.displayName, 'Account-owned display');
        const persisted = await app.bean.user.findOneById(oauthUserId!);
        assert.equal(persisted?.displayName, 'Account-owned display');
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({ name: linkedName }, true);
        linkedUserId = user.id.toString();
      });
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(linkedUserId!);
        assert.ok(user);
        await app.bean.passport.setCurrent({ user });
        try {
          const provider = await app.bean.authProvider.get({
            providerName: 'auth-oauth:oauth',
            clientName: 'github',
          });
          const passport = await app.scope('a-auth').service.auth.issuePassport(
            { ...profile, id: linkedProfileId },
            provider,
            {},
            {
              intention: 'associate',
              authProviderId: provider.id,
              instanceName: app.ctx.instanceName!,
              locale: app.ctx.locale,
              tz: app.ctx.tz,
            },
          );
          assert.equal(passport.user?.id.toString(), linkedUserId);
          assert.equal(passport.user?.name, linkedName);
          assert.equal(passport.user?.displayName, undefined);
          const persisted = await app.bean.user.findOneById(linkedUserId!);
          assert.equal(persisted?.name, linkedName);
          assert.equal(persisted?.displayName, undefined);
          const auth = await app.scope('a-auth').model.auth.get({
            authProviderId: provider.id,
            profileId: linkedProfileId,
          });
          assert.equal(auth?.userId.toString(), linkedUserId);
        } finally {
          await app.bean.passport.setCurrent(undefined);
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const provider = await app.bean.authProvider.get({
          providerName: 'auth-oauth:oauth',
          clientName: 'github',
        });
        for (const id of [linkedProfileId, profileId]) {
          await app
            .scope('a-auth')
            .model.auth.delete({ authProviderId: provider.id, profileId: id });
        }
        for (const name of [linkedName, oauthName]) {
          const user = await app.bean.user.findOneByName(name);
          if (user) {
            await app.scope('home-user').model.roleUser.delete({ userId: user.id });
            await app.bean.user.removeById(user.id);
          }
        }
      });
    }
  });

  it('OpenAPI exposes a required nullable table identity on current and every Passport/JWT response', async () => {
    await app.bean.executor.mockCtx(async () => {
      const actions = [
        ['current', 'get'],
        ['register', 'post'],
        ['login', 'post'],
        ['associate', 'get'],
        ['migrate', 'get'],
        ['createPassportJwtFromOauthCode', 'post'],
      ] as const;
      for (const [action, method] of actions) {
        const doc = await app.bean.openapi.generateJsonOfControllerAction(
          ControllerPassport,
          action,
          'V31',
        );
        const resolve = (schema: SchemaObject): SchemaObject => {
          if (!schema.$ref) return schema;
          const resolved =
            doc.components?.schemas?.[schema.$ref.replace('#/components/schemas/', '')];
          assert.ok(resolved);
          return resolve(resolved as SchemaObject);
        };
        const operation = Object.values(doc.paths ?? {}).find(item => item?.[method])?.[method];
        assert.ok(operation);
        const response = operation.responses?.['200'];
        assert.ok(response && 'content' in response);
        const body = resolve(response.content?.['application/json']?.schema as SchemaObject);
        assert.ok(body.properties?.data);
        const data = resolve(body.properties.data as SchemaObject);
        const passport =
          action === 'current' ? data : resolve(data.properties?.passport as SchemaObject);
        assert.ok(passport.required?.includes('instanceId'));
        const instanceId = resolve(passport.properties?.instanceId as SchemaObject);
        const user = resolve(passport.properties?.user as SchemaObject);
        const userId = resolve(user.properties?.id as SchemaObject);
        const displayName = resolve(user.properties?.displayName as SchemaObject);
        assert.deepEqual(displayName.type, ['string', 'null']);
        assert.equal(user.required?.includes('displayName') ?? false, false);
        const types = (schema: SchemaObject): string[] => {
          if (schema.anyOf)
            return schema.anyOf.flatMap(item => types(resolve(item as SchemaObject)));
          return Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
        };
        const instanceTypes = types(instanceId);
        assert.ok(instanceTypes.includes('null'));
        assert.deepEqual(
          instanceTypes.filter(type => type !== 'null').sort(),
          types(userId).sort(),
        );
        assert.equal(user.properties?.instanceId, undefined);
        if (operation.requestBody && 'content' in operation.requestBody) {
          const request = resolve(
            operation.requestBody.content['application/json'].schema as SchemaObject,
          );
          assert.equal(request.properties?.instanceId, undefined);
        }
      }
    });
  });
});
