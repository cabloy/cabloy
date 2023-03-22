module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate12 {
    async run(options) {
      // aAtomClass: add atomClassInner
      const sql = `
        ALTER TABLE aAtomClass
          ADD COLUMN atomClassInner int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // need not update atomClassInner: because it is deprecated
      // // update exists atomClasses
      // await this._updateAtomClasses(options);
    }

    // async _updateAtomClasses(options) {
    //   // all instances
    //   const instances = await ctx.bean.instance.list({ where: {} });
    //   for (const instance of instances) {
    //     await ctx.meta.util.executeBean({
    //       subdomain: instance.name,
    //       beanModule: moduleInfo.relativeName,
    //       beanFullName: `${moduleInfo.relativeName}.version.manager`,
    //       context: options,
    //       fn: 'update12AtomClasses',
    //     });
    //   }
    // }

    // async _updateAtomClassesInstance() {
    //   // atomClasses
    //   const atomClasses = await ctx.model.atomClass.select();
    //   for (const atomClass of atomClasses) {
    //     const _atomClass = ctx.bean.base.atomClass(atomClass);
    //     if (_atomClass.inner) {
    //       await ctx.model.atomClass.update({ id: atomClass.id, atomClassInner: 1 });
    //     }
    //   }
    // }
  }

  return VersionUpdate12;
};
