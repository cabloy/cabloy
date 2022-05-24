module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache all smsProviders
      await this.ctx.bean.smsProviderCache._cacheSmsProvidersConfig();
    }
  }

  return Startup;
};
