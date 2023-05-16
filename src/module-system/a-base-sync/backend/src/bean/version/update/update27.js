module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate27 {
    get modelRoleRight() {
      return ctx.model.module(moduleInfo.relativeName).roleRight;
    }

    async run(options) {
      // aRoleRight: add roleAtomId
      const sql = `
        ALTER TABLE aRoleRight
          Add COLUMN roleAtomId int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);
      // adjustRoleRights
      await this._adjustRoleRights(options);
    }

    async _adjustRoleRights(options) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: 'update26_adjustRoleRights',
        });
      }
    }

    async _adjustRoleRightsInstance() {
      // select all role rights
      const roleRights = await this.modelRoleRight.select();
      for (const roleRight of roleRights) {
        const roleId = roleRight.roleId;
        const role = await ctx.bean.role.get({ id: roleId });
        const roleAtomId = role.atomId;
        await this.modelRoleRight.update({ id: roleRight.id, roleAtomId });
      }
    }
  }

  return VersionUpdate27;
};
