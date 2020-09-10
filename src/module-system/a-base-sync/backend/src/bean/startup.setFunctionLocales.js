module.exports = app => {
  class Startup extends app.meta.BeanBase {

    async execute() {
      await this.ctx.bean.function.setLocales({ reset: true });
    }

  }

  return Startup;
};
