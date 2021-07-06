module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      await this.ctx.bean.resource.checkLocales();
    }
  }

  return Startup;
};
