module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate19 {
    async run() {
      // adjustCategories
      await this._adjustCategories({ resourceType: 'a-base:menu' });
      await this._adjustCategories({ resourceType: 'a-base:mine' });
    }

    async _adjustCategories({ resourceType }) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: {
            resourceType,
          },
          fn: 'update19_adjustCategories',
        });
      }
    }

    async _adjustCategoriesInstance({ resourceType }) {
      // select all resources
      const roles = await this.modelRole.select({ where: { atomId: 0 } });
    }
  }

  return VersionUpdate19;
};
