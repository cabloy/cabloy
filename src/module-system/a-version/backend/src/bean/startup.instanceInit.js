module.exports = app => {
  // const moduleInfo = module.info;
  class Startup extends app.meta.BeanBase {
    async execute(context) {
      const options = context.options;
      const beanVersion = this.ctx.bean.local.version;
      return await beanVersion.instanceInitStartup({ options });
    }
  }

  return Startup;
};
