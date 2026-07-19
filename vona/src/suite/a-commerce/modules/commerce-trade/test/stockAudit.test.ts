import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('stockAudit.test.ts', () => {
  it('action:stockAudit permits system-admin read actions only', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const actions = ['select', 'view'];
        const permissions = await Promise.all(
          actions.map(action =>
            app.bean.permission.retrievePermissionAction('commerce-trade:stockAudit', action),
          ),
        );
        assert.deepEqual(
          permissions,
          actions.map(() => true),
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:stockAudit', 'create'),
          false,
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:stockAudit', 'update'),
          false,
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:stockAudit', 'delete'),
          false,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
