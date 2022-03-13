module.exports = ctx => {
  class IAuthProviderBase {
    constructor({ authProvider, providerModule, providerName, providerScene }) {
      this.authProvider = authProvider;
      this.providerModule = providerModule;
      this.providerName = providerName;
      this.providerScene = providerScene;
    }
    // should be overrided
    async getConfigDefault() {
      throw new Error('getConfigDefault not implemented');
    }
    // should be overrided
    checkConfigValid(/* config */) {
      throw new Error('checkConfigValid not implemented');
    }
    // should be overrided
    getStrategy() {
      throw new Error('getStrategy not implemented');
    }
    // should be overrided
    async onVerify(/* ...args */) {
      throw new Error('onVerify not implemented');
    }
    get configProviderCache() {
      return ctx.bean.authProvider.getAuthProviderConfigCache(this.providerModule, this.providerName);
    }
    get configProviderScene() {
      const { configProviderScenes } = this.configProviderCache;
      if (this.authProvider.meta.scene) {
        return configProviderScenes[this.providerScene];
      }
      return configProviderScenes.default;
    }
    get providerSceneValid() {
      return this.configProviderScene.__valid;
    }
  }
  return IAuthProviderBase;
};
