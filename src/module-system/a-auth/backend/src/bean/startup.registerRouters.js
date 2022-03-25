module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // register routers
      await this.ctx.bean.authProvider._registerRouters();
    }
  }

  return Startup;
};
