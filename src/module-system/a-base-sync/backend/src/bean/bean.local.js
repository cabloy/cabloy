module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'local');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

  }

  return Local;
};
