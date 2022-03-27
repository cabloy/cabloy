module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };
  class VersionUpdate14 {
    get modelRole() {
      return ctx.model.role;
    }

    async run(options) {
      // adjustRoles
      await this._adjustRoles(options);
      // adjustUserRoles
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
    async _adjustRolesInstance() {
      // select all roles where atomId=0
      const roles = await this.modelRole.select({ where: { atomId: 0 } });
      for (const role of roles) {
        const roleId = role.id;
        // add atom
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassRole,
          item: {
            itemId: roleId,
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
