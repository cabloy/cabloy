const initData = require('./initData2.js');

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roles
      const roleIds = await this._initRoles();
      await ctx.meta.role.build();
      // users
      await this._initUsers(roleIds, options);
    }

    // roles
    async _initRoles() {
      const roleIds = {};
      roleIds.system = 0;
      // system roles
      for (const roleName of ctx.constant.systemRoles) {
        const role = initData.roles[roleName];
        role.roleIdParent = roleIds[role.roleIdParent];
        roleIds[roleName] = await ctx.meta.role.add(role);
      }
      return roleIds;
    }

    // users
    async _initUsers(roleIds, options) {
      // root user
      const userRoot = initData.users.root;
      userRoot.email = options.email;
      userRoot.mobile = options.mobile;
      const userId = await ctx.meta.user.add(userRoot.item);
      // user->role
      await ctx.meta.role.addUserRole({
        userId,
        roleId: roleIds[userRoot.roleId],
      });
    }

  }

  return VersionInit;
};
