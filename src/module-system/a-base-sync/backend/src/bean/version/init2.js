const initData = require('./initData2.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionInit {
    async run(options) {
      // roles
      const roleIds = await this._initRoles();
      // role includes
      await this._roleIncludes(roleIds);
      // build
      await ctx.bean.role.setDirty(true);
      // users
      await this._initUsers(roleIds, options);
    }

    // roles
    async _initRoles() {
      return await ctx.bean.role._initSystemRoles({
        module: moduleInfo.relativeName,
        rolesData: initData.roles,
      });
    }

    // role includes
    async _roleIncludes(roleIds) {
      for (const item of initData.includes) {
        await ctx.bean.role.addRoleInc({ roleId: roleIds[item.from], roleIdInc: roleIds[item.to] });
      }
    }

    // users
    async _initUsers(roleIds, options) {
      // users
      const users = [];
      // user: root
      const userRoot = ctx.bean.util.extend({}, initData.users.root);
      userRoot.item.email = options.email;
      userRoot.item.mobile = options.mobile;
      users.push(userRoot);
      // user: admin
      const demo = ctx.config.module(moduleInfo.relativeName).configFront.demo;
      if (demo.enable) {
        const userAdmin = ctx.bean.util.extend({}, initData.users.admin);
        users.push(userAdmin);
      }
      for (const user of users) {
        const userId = await ctx.bean.user.add(user.item);
        // activated
        await ctx.bean.user.save({
          user: { id: userId, activated: 1 },
        });
        // user->role
        await ctx.bean.role.addUserRole({
          userId,
          roleId: roleIds[user.roleId],
        });
      }
    }
  }

  return VersionInit;
};
