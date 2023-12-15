module.exports = class Startup {
  async execute(/* context*/) {
    // cache all authProviders
    await this.ctx.bean.authProviderCache._cacheAuthProvidersConfig();
  }
};
