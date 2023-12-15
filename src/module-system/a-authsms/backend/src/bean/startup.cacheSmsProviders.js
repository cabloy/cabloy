module.exports = class Startup {
  async execute(/* context*/) {
    // cache all smsProviders
    await this.ctx.bean.smsProviderCache._cacheSmsProvidersConfig();
  }
};
