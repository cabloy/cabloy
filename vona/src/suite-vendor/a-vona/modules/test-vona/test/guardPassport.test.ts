import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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
      await app.bean.passport.signout();
    });
  });
});
