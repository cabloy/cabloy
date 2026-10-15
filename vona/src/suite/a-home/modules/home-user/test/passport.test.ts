import type { SchemaObject } from 'openapi3-ts/oas31';
import type { IPassport } from 'vona-module-a-user';

import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

import { ControllerPassport } from '../src/controller/passport.ts';

function createPassport(): IPassport {
  return {
    user: {
      id: 'passport-response-user',
      name: 'Passport response fixture',
      activated: true,
      accountStatus: 'active',
      instanceId: 'untrusted-user-instance',
    },
    auth: { id: 'passport-response-auth', instanceId: 'untrusted-auth-instance' },
    roles: [],
  } as IPassport;
}

const jwt = {
  accessToken: 'passport-response-access',
  refreshToken: 'passport-response-refresh',
};

describe('passport.test.ts', { concurrency: false }, () => {
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
      assert.equal(result.auth, passport.auth);
      assert.equal(result.roles, passport.roles);
      assert.equal('instanceId' in result.user, false);
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
