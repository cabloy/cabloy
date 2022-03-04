module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class UserOnline extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'userOnline');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }
  }
  return UserOnline;
};
