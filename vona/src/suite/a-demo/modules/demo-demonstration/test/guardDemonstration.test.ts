import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { GuardDemonstration, parseUsernameWhitelist } from 'vona-module-demo-demonstration';

const guardBeanName = 'demo-demonstration.guard.demonstration';
const businessRoute = {
  controllerBeanFullName: 'test.controller.business',
  action: 'write',
};

function guard() {
  return app.bean._getBean(guardBeanName as never) as GuardDemonstration;
}

function setRequest(method: string, route = businessRoute) {
  Object.defineProperty(app.ctx, 'method', {
    configurable: true,
    value: method,
  });
  app.ctx.route = route as any;
  app.ctx.innerAccess = false;
}

function isGuardEnabledForRoute(routePathRaw: string, enable = true): boolean {
  const options = app.bean.onion.guard.getOnionOptions('demo-demonstration:demonstration');
  assert.ok(options);
  return app.bean.onion.checkOnionOptionsEnabled({ ...options, enable }, routePathRaw);
}

describe('guardDemonstration.test.ts', () => {
  it('parses a trimmed, deduplicated username whitelist and exposes localized errors', async () => {
    assert.deepEqual(parseUsernameWhitelist(' admin, demo, ,admin '), ['admin', 'demo']);
    assert.deepEqual(parseUsernameWhitelist(undefined), []);
    assert.deepEqual(parseUsernameWhitelist(''), []);

    await app.bean.executor.mockCtx(async () => {
      const scopeDemonstration = app.scope('demo-demonstration');
      assert.equal(
        scopeDemonstration.locale.WriteForbidden.locale('zh-cn'),
        '在演示模式下禁止此操作',
      );
      assert.equal(
        scopeDemonstration.locale.WriteForbidden.locale('en-us'),
        'This operation is forbidden in demonstration mode',
      );
    });
  });

  it('does not select disabled guards and allows read methods', async () => {
    assert.equal(isGuardEnabledForRoute('/test/business/write', false), false);

    await app.bean.executor.mockCtx(async () => {
      const bean = guard();
      setRequest('GET');
      assert.equal(
        await bean.execute(
          { enable: true, methodsForWrite: ['POST'], usernameWhitelist: [] } as any,
          async () => true,
        ),
        true,
      );
    });
  });

  it('rejects non-whitelisted writes with the module error', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock('admin');
      try {
        setRequest('POST');
        const [_, err] = await catchError(() =>
          guard().execute(
            { enable: true, methodsForWrite: ['POST'], usernameWhitelist: [] } as any,
            async () => true,
          ),
        );
        assert.equal(err?.code, 'demo-demonstration:1001');
        assert.equal(err?.status, 403);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('allows an authenticated whitelisted user to write', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock('admin');
      try {
        setRequest('DELETE');
        assert.equal(
          await guard().execute(
            { enable: true, methodsForWrite: ['DELETE'], usernameWhitelist: ['admin'] } as any,
            async () => true,
          ),
          true,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('excludes only the configured authentication and OAuth route paths', () => {
    for (const routePathRaw of [
      '/home/user/passport/login',
      '/home/user/passport/login/:module/:providerName/:clientName?',
      '/home/user/passport/logout',
      '/home/user/passport/register',
      '/home/user/passport/associate/:module/:providerName/:clientName?',
      '/home/user/passport/migrate/:module/:providerName/:clientName?',
      '/home/user/passport/refreshAuthToken',
      '/home/user/passport/createPassportJwtFromOauthCode',
      '/home/user/passport/createTempAuthToken',
      '/auth/passport/callback',
    ]) {
      assert.equal(isGuardEnabledForRoute(routePathRaw), false);
    }
    assert.equal(isGuardEnabledForRoute('/test/business/write'), true);
  });
});
