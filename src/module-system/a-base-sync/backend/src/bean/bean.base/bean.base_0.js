module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'base');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }
  }

  return Base;
};
