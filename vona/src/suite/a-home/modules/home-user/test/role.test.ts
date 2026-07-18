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
      assert.ok(roleRegisteredUser?.siteIds.includes('web'));

      const roleSystemAdmin = await scope.model.role.getByName('systemAdmin');
      assert.equal(roleSystemAdmin?.title, 'System Administrator');
      assert.deepEqual(roleSystemAdmin?.locales, { 'zh-cn': '系统管理员' });
      assert.ok(roleSystemAdmin?.siteIds.includes('web'));
      assert.ok(roleSystemAdmin?.siteIds.includes('admin'));

      await app.bean.passport.signinMock();
      const passport = await app.bean.executor.performAction('get', '/home/user/passport/current');
      const passportRegisteredUser = passport.roles.find(
        (role: any) => role.name === 'registeredUser',
      );
      assert.equal(passportRegisteredUser?.title, 'Registered User');
      assert.deepEqual(passportRegisteredUser?.locales, { 'zh-cn': '注册用户' });
      assert.ok(passportRegisteredUser?.siteIds.includes('web'));

      const passportSystemAdmin = passport.roles.find((role: any) => role.name === 'systemAdmin');
      assert.equal(passportSystemAdmin?.title, 'System Administrator');
      assert.deepEqual(passportSystemAdmin?.locales, { 'zh-cn': '系统管理员' });
      assert.ok(passportSystemAdmin?.siteIds.includes('web'));
      assert.ok(passportSystemAdmin?.siteIds.includes('admin'));
    });
  });
});
