import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('permission.test.ts', () => {
  it('action:permission:anonymous', async () => {
    await app.bean.executor.mockCtx(async () => {
      const permissions = await app.bean.permission.getPermissionsDefault('test-rest:product');
      assert.equal(permissions?.actions?.create, false);
    });
  });
  it('action:permission:admin', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const permissions = await app.bean.permission.getPermissionsDefault('test-rest:product');
      assert.equal(permissions?.actions?.create, true);
    });
  });
});
