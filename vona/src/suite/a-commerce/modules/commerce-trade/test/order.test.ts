import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('order.test.ts', () => {
  it('action:order permits system-admin read actions only', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const actions = ['select', 'view'];
        const permissions = await Promise.all(
          actions.map(action =>
            app.bean.permission.retrievePermissionAction('commerce-trade:order', action),
          ),
        );
        assert.deepEqual(
          permissions,
          actions.map(() => true),
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:order', 'create'),
          false,
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:order', 'update'),
          false,
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:order', 'delete'),
          false,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
