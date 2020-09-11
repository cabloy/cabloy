module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Startup extends app.meta.BeanBase {

    async execute(context) {
      const options = context.options;
      const bean = this.ctx.bean._getBean(`${moduleInfo.relativeName}.local.version`);
      return await bean.instanceInitStartup({ options });
    }

  }

  return Startup;
};
