module.exports = ctx => {
  class IAuthProviderBase {
    constructor({ providerModule, providerName, providerScene }) {
      this.providerModule = providerModule;
      this.providerName = providerName;
      this.providerScene = providerScene;
      this.valid = false;
    }
    getAuthProvider() {
      const providerFullName = `${this.providerModule}:${this.providerName}`;
      const authProviders = ctx.bean.base.authProviders();
      return authProviders[providerFullName];
    }
    async load() {
      const configDefault = this.getConfigDefault();
    }
    getConfig() {}
  }
  return IAuthProviderBase;
};
