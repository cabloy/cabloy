module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Detail extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'detail');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelDetailBase() {
      return ctx.model.module(moduleInfo.relativeName).detailBase;
    }

    async _loopDetailClasses({ atomClass, fn }) {
      // all details of atom
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const atomClassDetails = atomClassBase.details;
      if (!atomClassDetails) return; // do nothing
      // loop
      for (let atomClassDetail of atomClassDetails) {
        atomClassDetail = await ctx.bean.atomClass.get(atomClassDetail);
        const atomClassBaseDetail = await ctx.bean.atomClass.atomClass(atomClassDetail);
        await fn({ atomClassDetail, atomClassBaseDetail });
      }
    }
  }

  return Detail;
};
