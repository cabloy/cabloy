module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache all authProviders
      await this.ctx.bean.authProvider._cacheAuthProviders();
    }
  }

  return Startup;
};
