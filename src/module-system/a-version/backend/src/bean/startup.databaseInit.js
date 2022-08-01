module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Startup extends app.meta.BeanBase {
    async execute() {
      const beanVersion = this.ctx.bean.local.version;
      return await beanVersion.databaseInitStartup();
    }
  }

  return Startup;
};
