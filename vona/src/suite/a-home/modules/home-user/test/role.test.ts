import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

describe('role.test.ts', { concurrency: false }, () => {
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

  it('bean:role emits only actual membership changes', async () => {
    let userId: string | undefined;
    let roleId: string | undefined;
    const events: Array<{ userIds: unknown[]; roleIds: unknown[] }> = [];
    const event = app.scope('a-user').event.roleMembershipChanged;
    const originalEmit = event.emit.bind(event);
    const emitMock = mock.method(event, 'emit', async data => {
      if (data.userIds.some(item => String(item) === userId)) {
        events.push(data);
      }
      return await originalEmit(data);
    });
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('home-user').model.role.insert({
          name: `home-user-role-${crypto.randomUUID()}`,
          title: 'Home User Role',
          siteIds: ['admin'],
          builtin: false,
        });
        roleId = String(role.id);
        const user = await app.bean.user.register({
          name: `home-user-role-member-${crypto.randomUUID()}`,
        });
        userId = String(user.id);

        assert.equal(await app.bean.role.addUserId(role.id, user.id), true);
        assert.equal(await app.bean.role.addUserId(role.id, user.id), false);

        const memberships = await app.scope('home-user').model.roleUser.select({
          where: { userId: user.id, roleId: role.id },
        });
        assert.equal(memberships.length, 1);
        assert.deepEqual(events, [{ userIds: [user.id], roleIds: [role.id] }]);

        assert.equal(await app.bean.role.removeUserId(role.id, user.id), true);
        assert.equal(await app.bean.role.removeUserId(role.id, user.id), false);
        assert.deepEqual(events, [
          { userIds: [user.id], roleIds: [role.id] },
          { userIds: [user.id], roleIds: [role.id] },
        ]);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const homeUser = app.scope('home-user');
          if (userId) {
            await homeUser.model.roleUser.delete({ userId });
            await app.bean.user.removeById(userId);
          }
          if (roleId) await homeUser.model.role.deleteById(roleId);
        });
      } finally {
        emitMock.mock.restore();
      }
    }
  });

  it('bean:role rolls back membership and policy invalidation together', async () => {
    let userId: string | undefined;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const homeUser = app.scope('home-user');
        const role = await homeUser.model.role.insert({
          name: `home-user-rollback-${crypto.randomUUID()}`,
          title: 'Home User Rollback Role',
          siteIds: ['admin'],
          builtin: false,
        });
        roleId = String(role.id);
        const user = await app.bean.user.register({
          name: `home-user-role-rollback-${crypto.randomUUID()}`,
        });
        userId = String(user.id);

        await assert.rejects(async () => {
          await app.bean.database.current.transaction.begin(async () => {
            await app.bean.role.addUserId(role.id, user.id);
            throw new Error('rollback role membership');
          });
        }, /rollback role membership/);

        assert.equal(
          await homeUser.model.roleUser.get({ userId: user.id, roleId: role.id }),
          undefined,
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const homeUser = app.scope('home-user');
        if (userId) {
          await homeUser.model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
        if (roleId) await homeUser.model.role.deleteById(roleId);
      });
    }
  });

  it('bean:role replaces a membership set with one change event', async () => {
    let userId: string | undefined;
    const roleIds: string[] = [];
    const events: Array<{ userIds: unknown[]; roleIds: unknown[] }> = [];
    const event = app.scope('a-user').event.roleMembershipChanged;
    const originalEmit = event.emit.bind(event);
    const emitMock = mock.method(event, 'emit', async data => {
      if (data.userIds.some(item => String(item) === userId)) {
        events.push(data);
      }
      return await originalEmit(data);
    });
    try {
      await app.bean.executor.mockCtx(async () => {
        const homeUser = app.scope('home-user');
        const roles = await Promise.all(
          ['a', 'b', 'c'].map(async suffix => {
            const role = await homeUser.model.role.insert({
              name: `home-user-replace-${suffix}-${crypto.randomUUID()}`,
              title: `Home User Role ${suffix}`,
              siteIds: ['admin'],
              builtin: false,
            });
            roleIds.push(String(role.id));
            return role;
          }),
        );
        const user = await app.bean.user.register({
          name: `home-user-role-replace-${crypto.randomUUID()}`,
        });
        userId = String(user.id);
        await app.bean.role.addUserId(roles[0].id, user.id);
        await app.bean.role.addUserId(roles[1].id, user.id);
        events.length = 0;

        const result = await app.bean.role.replaceUserRoleIds(user.id, [roles[1].id, roles[2].id]);
        assert.deepEqual(result, { addedRoleIds: [roles[2].id], removedRoleIds: [roles[0].id] });
        assert.equal(events.length, 1);
        assert.deepEqual(events[0]?.userIds, [user.id]);
        assert.deepEqual(events[0]?.roleIds.toSorted(), [roles[0].id, roles[2].id].toSorted());

        const memberships = await homeUser.model.roleUser.select({ where: { userId: user.id } });
        assert.deepEqual(
          memberships.map(item => String(item.roleId)).toSorted(),
          [String(roles[1].id), String(roles[2].id)].toSorted(),
        );
        await app.bean.role.replaceUserRoleIds(user.id, [roles[1].id, roles[2].id]);
        assert.equal(events.length, 1);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const homeUser = app.scope('home-user');
          if (userId) {
            await homeUser.model.roleUser.delete({ userId });
            await app.bean.user.removeById(userId);
          }
          for (const roleId of roleIds.reverse()) {
            await homeUser.model.role.deleteById(roleId);
          }
        });
      } finally {
        emitMock.mock.restore();
      }
    }
  });
});
