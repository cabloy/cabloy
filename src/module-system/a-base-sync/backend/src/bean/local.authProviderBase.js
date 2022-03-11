module.exports = ctx => {
  class IAuthProviderBase {
    constructor(providerScene) {
      this.providerScene = providerScene;
    }
    getConfig() {}
  }
  return IAuthProviderBase;
};
