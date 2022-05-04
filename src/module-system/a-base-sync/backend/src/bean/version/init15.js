const require3 = require('require3');
const extend = require3('extend2');
const initData = require('./initData15.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionInit {
    async run() {
      // roles
      await this._initRoles();
      // change roleIdOwner
    }

    // roles
    async _initRoles() {
      const roleIds = {};
      // system roles
      for (const roleName in initData.roles) {
        let role = initData.roles[roleName];
        const exists = await ctx.bean.role.getSystemRole({ roleName });
        if (!exists) {
          // parent
          const roleParent = await ctx.bean.role.getSystemRole({ roleName: role.roleIdParent });
          role = extend(true, { module: moduleInfo.relativeName }, role);
          role.roleIdParent = roleParent.id;
          roleIds[roleName] = await ctx.bean.role.add(role);
        }
      }
      return roleIds;
    }
  }

  return VersionInit;
};
