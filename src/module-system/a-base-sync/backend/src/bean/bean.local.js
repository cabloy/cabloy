module.exports = ctx => {
  class Local extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'local');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }
  }

  return Local;
};
