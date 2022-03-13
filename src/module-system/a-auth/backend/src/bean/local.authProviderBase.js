module.exports = ctx => {
  class IAuthProviderBase {
    constructor({ authProvider, providerModule, providerName, providerScene }) {
      this.authProvider = authProvider;
      this.providerModule = providerModule;
      this.providerName = providerName;
      this.providerScene = providerScene;
      this.configProviderScene = null;
      this.providerSceneValid = false;
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
    async loadConfigProvider() {}
    loadConfigScene() {
      const { configProvider, providerItem } = this.configProviderCache;
      if (this.authProvider.meta.scene) {
        // scene: true
        const scene = configProvider.scenes[this.providerScene];
        const titleLocale = this._getTitleLocale({
          locales: configProvider.locales,
          title: scene.title,
          locale: ctx.locale,
        });
        this.configProviderScene = { ...scene, titleLocale };
      } else {
        this.configProviderScene = configProvider;
      }
      // providerSceneValid
      this.providerSceneValid =
        !providerItem.disabled && !this.configProviderScene.disabled && this.configProviderSceneValid();
    }

    _getTitleLocale({ locales, title, locale }) {
      let titleLocale = ctx.bean.util.getProperty(locales, `${locale}.${title}`);
      if (!titleLocale && locale !== 'en-us') {
        titleLocale = ctx.bean.util.getProperty(locales, `en-us.${title}`);
      }
      // not use system locale
      // if (!titleLocale) {
      //   titleLocale = ctx.text(title);
      // }
      return titleLocale || title;
    }
  }
  return IAuthProviderBase;
};
