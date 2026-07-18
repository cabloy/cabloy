import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const resourceName = 'commerce-siteadmin:operator';
const actionName = 'context';
const actionPath = '/commerce/siteadmin/operator/context';

describe('operatorAccess.test.ts', () => {
  it('action:operator:context:denies anonymous callers', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [_, err] = await catchError(() =>
        app.bean.executor.performAction('get', actionPath, { innerAccess: false }),
      );
      assert.equal(err?.code, 401);
    });
  });

  it('action:operator:context:denies non-system administrators', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        app.bean.passport.current!.roles = [];
        const [_, err] = await catchError(() =>
          app.bean.executor.performAction('get', actionPath, { innerAccess: false }),
        );
        assert.equal(err?.code, 403);
        assert.equal(
          await app.bean.permission.retrievePermissionAction(resourceName, actionName),
          false,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:operator:context:returns server-derived context to system administrators', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const result = await app.bean.executor.performAction('get', actionPath, {
          innerAccess: false,
        });
        assert.equal(result.instanceId, app.ctx.instance.id.toString());
        assert.equal(result.instanceName, app.ctx.instanceName);
        assert.equal(result.userId, app.bean.passport.current!.user!.id.toString());
        assert.equal(result.userName, app.bean.passport.current!.user!.name);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
