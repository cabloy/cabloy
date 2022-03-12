const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  class IAuthProviderBase {
    constructor({ authProvider, providerModule, providerName, providerScene }) {
      this.authProvider = authProvider;
      this.providerModule = providerModule;
      this.providerName = providerName;
      this.providerScene = providerScene;
      this.configProvider = null;
      this.configProviderScene = null;
      this.providerItem = null;
      this.providerSceneValid = false;
    }
    async loadConfigProvider() {
      // config default
      const configDefault = await this.getConfigDefault();
      // provider item
      const providerItem = await ctx.bean.authProvider.getAuthProvider({
        module: this.providerModule,
        providerName: this.providerName,
      });
      this.providerItem = providerItem;
      if (this.authProvider.meta.scene) {
        // scene: true
        const itemScenes = providerItem.scenes ? JSON.parse(providerItem.scenes) : null;
        const itemLocales = providerItem.locales ? JSON.parse(providerItem.locales) : null;
        const scenes = extend(true, {}, configDefault && configDefault.scenes, itemScenes);
        const locales = extend(true, {}, configDefault && configDefault.locales, itemLocales);
        this.configProvider = {
          scenes,
          locales,
        };
      } else {
        // scene: false
        const itemConfig = providerItem.config ? JSON.parse(providerItem.config) : null;
        this.configProvider = extend(true, {}, configDefault, itemConfig);
      }
      return this.configProvider;
    }
    async loadConfigScene() {
      const configProvider = await this.loadConfigProvider();
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
        this.configProviderScene = this.configProvider;
      }
      // providerSceneValid
      this.providerSceneValid =
        !this.providerItem.disabled && !this.configProviderScene.disabled && this.configProviderSceneValid();
    }

    configProviderSceneValid() {
      return true;
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
