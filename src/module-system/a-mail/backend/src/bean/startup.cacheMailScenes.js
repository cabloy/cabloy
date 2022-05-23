module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache all mailProviders
      await this.ctx.bean.mailProviderCache._cacheMailProvidersConfig();
    }
  }

  return Startup;
};
