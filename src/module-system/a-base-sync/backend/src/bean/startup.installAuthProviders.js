module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // register all authProviders
      await this.ctx.bean.authProvider._installAuthProviders();
    }
  }

  return Startup;
};
