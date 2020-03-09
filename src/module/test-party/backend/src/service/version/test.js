const testData = require('./testData.js');

module.exports = function(ctx) {

  class VersionTest {

    async run() {

      // roles
      const roleIds = await this._testRoles();

      // role includes
      await this._testRoleIncs(roleIds);

      // set role dirty
      await ctx.meta.role.setDirty(true);

      // users
      const userIds = await this._testUsers(roleIds);

      // role rights
      await this._testRoleRights(roleIds);

      // cache
      this._testCache(roleIds, userIds);
    }

    _testCache(roleIds, userIds) {
      // cache roles
      ctx.cache.mem.set('roleIds', roleIds);
      // cache users
      ctx.cache.mem.set('userIds', userIds);
    }

    // roles
    async _testRoles() {
      const roleIds = {};
      // system roles
      for (const roleName of ctx.constant.module('a-base').systemRoles) {
        const role = await ctx.meta.role.getSystemRole({ roleName });
        roleIds[roleName] = role.id;
      }
      // roles
      for (const [ roleName, leader, catalog, roleNameParent ] of testData.roles) {
        roleIds[roleName] = await ctx.meta.role.add({
          roleName,
          leader,
          catalog,
          roleIdParent: roleIds[roleNameParent],
        });
      }

      return roleIds;
    }

    // role incs
    async _testRoleIncs(roleIds) {
      for (const [ roleId, roleIdInc ] of testData.roleIncs) {
        await ctx.meta.role.addRoleInc({
          roleId: roleIds[roleId],
          roleIdInc: roleIds[roleIdInc],
        });
      }
    }

    // users
    async _testUsers(roleIds) {
      // userIds
      const userIds = {};
      for (const [ userName, roleName ] of testData.users) {
        // add
        userIds[userName] = await ctx.meta.user.add({
          userName,
          realName: userName,
        });
        // activated
        await ctx.meta.user.save({
          user: { id: userIds[userName], activated: 1 },
        });
        // role
        await ctx.meta.role.addUserRole({
          userId: userIds[userName],
          roleId: roleIds[roleName],
        });
      }

      // auths
      await this._testAuths(userIds);

      // root
      const userRoot = await ctx.meta.user.get({ userName: 'root' });
      userIds.root = userRoot.id;
      return userIds;
    }

    // role rights
    async _testRoleRights() {
      // atomClass
      await ctx.meta.role.addRoleRightBatch({ atomClassName: 'party', roleRights: testData.roleRights });
      // function
      const roleFunctions = [
        { roleName: null, name: 'testFunctionPublic' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

    // auths
    async _testAuths(userIds) {
      for (const userName in userIds) {
        await ctx.performAction({
          method: 'post',
          url: '/a/authsimple/auth/add',
          body: {
            userId: userIds[userName],
            password: '',
          },
        });
      }
    }

  }

  return VersionTest;
};
