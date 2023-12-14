module.exports = class AuthProviderBase {
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
  //
  async adjustConfigForCache(config) {
    return config;
  }
  async adjustConfigForAuthenticate(config) {
    return config;
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
    return this.ctx.bean.authProviderCache.getAuthProviderConfigCache(this.providerModule, this.providerName);
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
  get allowStrategyMock() {
    return (this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal) && this.ctx.host.indexOf('localhost:') === 0;
  }
  get metaScene() {
    if (this.authProvider.meta.scene) {
      const scene = this.authProvider.scenes && this.authProvider.scenes[this.providerScene];
      return (scene && scene.meta) || this.authProvider.meta;
    }
    return this.authProvider.meta;
  }
};
