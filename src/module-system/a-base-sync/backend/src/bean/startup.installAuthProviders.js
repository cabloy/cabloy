module.exports = app => {
  class Startup extends app.meta.BeanBase {

    async execute() {
      // register all authProviders
      await this.ctx.bean.auth._installAuthProviders();
    }

  }

  return Startup;
};
