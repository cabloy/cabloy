import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('role.test.ts', () => {
  it('action:roleSeedAndPassport', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('home-user');
      const roleRegisteredUser = await scope.model.role.getByName('registeredUser');
      assert.equal(roleRegisteredUser?.title, 'Registered User');
      assert.deepEqual(roleRegisteredUser?.locales, { 'zh-cn': '注册用户' });
      assert.deepEqual(roleRegisteredUser?.siteIds, ['web']);

      const roleSystemAdmin = await scope.model.role.getByName('systemAdmin');
      assert.equal(roleSystemAdmin?.title, 'System Administrator');
      assert.deepEqual(roleSystemAdmin?.locales, { 'zh-cn': '系统管理员' });
      assert.deepEqual(roleSystemAdmin?.siteIds, ['web', 'admin']);

      await app.bean.passport.signinMock();
      const passport = await app.bean.executor.performAction('get', '/home/user/passport/current');
      assert.deepEqual(
        passport.roles.map(role => ({
          name: role.name,
          title: role.title,
          locales: role.locales,
          siteIds: role.siteIds,
        })),
        [
          {
            name: 'registeredUser',
            title: 'Registered User',
            locales: { 'zh-cn': '注册用户' },
            siteIds: ['web'],
          },
          {
            name: 'systemAdmin',
            title: 'System Administrator',
            locales: { 'zh-cn': '系统管理员' },
            siteIds: ['web', 'admin'],
          },
        ],
      );
    });
  });
});
