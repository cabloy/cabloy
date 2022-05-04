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
      await this._changeRoleIdOwner();
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

    async _changeRoleIdOwner() {
      // change roleIdOwner from template.system to authenticated.builtIn for atomClass except role
      const roleSystem = await ctx.bean.role.getSystemRole({ roleName: 'system' });
      const roleBuiltIn = await ctx.bean.role.getSystemRole({ roleName: 'builtIn' });
      const atomClassRole = await ctx.bean.atomClass.get({ module: moduleInfo.relativeName, atomClassName: 'role' });
      await ctx.model.query(
        `
          update aAtom set roleIdOwner=? where iid=? and atomClassId<>? and roleIdOwner=?
      `,
        [roleBuiltIn.id, ctx.instance.id, atomClassRole.id, roleSystem.id]
      );
    }
  }

  return VersionInit;
};
