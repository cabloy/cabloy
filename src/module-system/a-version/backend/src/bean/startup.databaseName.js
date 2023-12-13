module.exports = app => {
  // const moduleInfo = module.info;
  class Startup extends app.meta.BeanBase {
    async execute() {
      const beanVersion = this.ctx.bean.local.version;
      return await beanVersion.databaseNameStartup();
    }
  }

  return Startup;
};
