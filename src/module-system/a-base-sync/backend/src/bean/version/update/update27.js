module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate27 {
    get modelRoleExpand() {
      return ctx.model.module(moduleInfo.relativeName).roleExpand;
    }

    async run(options) {
      // aRoleExpand: add roleAtomId
      const sql = `
        ALTER TABLE aRoleExpand
          Add COLUMN roleAtomId int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);
      // adjustRoleExpands
      await this._adjustRoleExpands(options);
    }

    async _adjustRoleExpands(options) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: 'update27_adjustRoleExpands',
        });
      }
    }

    async _adjustRoleExpandsInstance() {
      // select all role rights
      const roleExpands = await this.modelRoleExpand.select();
      for (const roleExpand of roleExpands) {
        const roleId = roleExpand.roleId;
        const role = await ctx.bean.role.get({ id: roleId });
        const roleAtomId = role.atomId;
        await this.modelRoleExpand.update({ id: roleExpand.id, roleAtomId });
      }
    }
  }

  return VersionUpdate27;
};
