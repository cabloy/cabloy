module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };
  const __atomClassUserRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'userRole',
  };
  class VersionUpdate14 {
    get modelRole() {
      return ctx.model.role;
    }
    get modelUserRole() {
      return ctx.model.userRole;
    }

    async run(options) {
      // adjustRoles
      await this._adjustRoles(options);
      // adjustUserRoles
      await this._adjustUserRoles(options);
    }

    async _adjustRoles(options) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: 'update14_adjustRoles',
        });
      }
    }

    async _adjustUserRoles(options) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: 'update14_adjustUserRoles',
        });
      }
    }

    async _adjustRolesInstance() {
      // select all roles where atomId=0
      const roles = await this.modelRole.select({ where: { atomId: 0 } });
      for (const role of roles) {
        const roleId = role.id;
        const roleName = role.roleName;
        // add atom
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassRole,
          item: {
            itemId: roleId,
            atomStaticKey: `${moduleInfo.relativeName}:role_${roleName}`,
            catalog: role.catalog,
            system: role.system,
            roleIdParent: role.roleIdParent,
          },
          user: { id: 0 },
        });
        await ctx.bean.atom.write({
          key: atomKey,
          item: {
            atomName: roleName,
          },
          user: { id: 0 },
        });
        // submit
        await ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
      }
    }

    async _adjustUserRolesInstance() {
      // select all roles where atomId=0
      const items = await this.modelUserRole.select({ where: { atomId: 0 } });
      for (const item of items) {
        const userRoleId = item.id;
        // add atom
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassUserRole,
          item: {
            itemId: userRoleId,
            userId: item.userId,
            roleId: item.roleId,
          },
          user: { id: 0 },
        });
        // submit
        await ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
      }
    }
  }

  return VersionUpdate14;
};
