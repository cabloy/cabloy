import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('role.test.ts', () => {
  it('action:roleSeedAndPassport', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('home-user');
      const roleRegisteredUser = await scope.model.role.getByName('registeredUser');
      assert.equal(roleRegisteredUser?.title, 'Registered User');
      assert.deepEqual(roleRegisteredUser?.titleLocales, { 'zh-cn': '注册用户' });
      assert.deepEqual(
        roleRegisteredUser?.siteIds,
        scope.config.builtinRoles.registeredUser.siteIds,
      );
      assert.equal(roleRegisteredUser?.builtin, true);

      const roleSystemAdmin = await scope.model.role.getByName('systemAdmin');
      assert.equal(roleSystemAdmin?.title, 'System Administrator');
      assert.deepEqual(roleSystemAdmin?.titleLocales, { 'zh-cn': '系统管理员' });
      assert.deepEqual(roleSystemAdmin?.siteIds, scope.config.builtinRoles.systemAdmin.siteIds);
      assert.equal(roleSystemAdmin?.builtin, true);

      await app.bean.passport.signinMock();
      const passport = await app.bean.executor.performAction('get', '/home/user/passport/current');
      const passportRegisteredUser = passport.roles.find(
        (role: any) => role.name === 'registeredUser',
      );
      assert.equal(passportRegisteredUser?.title, 'Registered User');
      assert.deepEqual(passportRegisteredUser?.titleLocales, { 'zh-cn': '注册用户' });
      assert.deepEqual(
        passportRegisteredUser?.siteIds,
        scope.config.builtinRoles.registeredUser.siteIds,
      );
      assert.equal(passportRegisteredUser?.builtin, true);

      const passportSystemAdmin = passport.roles.find((role: any) => role.name === 'systemAdmin');
      assert.equal(passportSystemAdmin?.title, 'System Administrator');
      assert.deepEqual(passportSystemAdmin?.titleLocales, { 'zh-cn': '系统管理员' });
      assert.deepEqual(passportSystemAdmin?.siteIds, scope.config.builtinRoles.systemAdmin.siteIds);
      assert.equal(passportSystemAdmin?.builtin, true);
    });
  });
});
