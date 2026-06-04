import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const ResourceGuardPassport = 'test-vona:guardPassport';

describe('guardPassport.test.ts', () => {
  it('action:guardPassport:userName', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const res = await app.bean.executor.performAction(
        'get',
        '/test/vona/guardPassport/testUserName',
        {
          innerAccess: false,
        },
      );
      assert.equal(res, undefined);
      const [_, err] = await catchError(() => {
        return app.bean.executor.performAction('get', '/test/vona/guardPassport/testUserNameFail', {
          innerAccess: false,
        });
      });
      assert.equal(err?.code, 403);
      const permissions = await app.bean.permission.getPermissionsDefault(ResourceGuardPassport);
      assert.equal(permissions?.actions?.testUserName, false);
      assert.equal(permissions?.actions?.testUserNameFail, false);
      await app.bean.passport.signout();
    });
  });

  it('action:guardPassport:roleName', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const res = await app.bean.executor.performAction(
        'get',
        '/test/vona/guardPassport/testRoleName',
        {
          innerAccess: false,
        },
      );
      assert.equal(res, undefined);
      const [_, err] = await catchError(() => {
        return app.bean.executor.performAction('get', '/test/vona/guardPassport/testRoleNameFail', {
          innerAccess: false,
        });
      });
      assert.equal(err?.code, 403);
      const permissions = await app.bean.permission.getPermissionsDefault(ResourceGuardPassport);
      assert.equal(permissions?.actions?.testRoleName, true);
      assert.equal(permissions?.actions?.testRoleNameFail, false);
      await app.bean.passport.signout();
    });
  });

  it('action:guardPassport:cacheKeyByRoleProfile', async () => {
    await app.bean.executor.mockCtx(async () => {
      const cacheKeyAnonymous = (app.bean.permission as any).retrievePermissionsDefaultCacheKey({
        args: [ResourceGuardPassport],
      });
      assert.equal(cacheKeyAnonymous, 'default:test-vona:guardPassport__anon');

      await app.bean.passport.signinMock('admin');
      const cacheKeyAdmin = (app.bean.permission as any).retrievePermissionsDefaultCacheKey({
        args: [ResourceGuardPassport],
      });
      assert.equal(cacheKeyAdmin, 'default:test-vona:guardPassport__auth__act:1__roles:admin');
      await app.bean.passport.signout();
    });
  });
});
