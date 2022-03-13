const require3 = require('require3');
const extend = require3('extend2');

const __authProvidersConfigCache = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthProviderCache {
    getAuthProvidersConfigCache() {
      return __authProvidersConfigCache[ctx.subdomain];
    }

    getAuthProviderConfigCache(module, providerName) {
      const providerFullName = `${module}:${providerName}`;
      return __authProvidersConfigCache[ctx.subdomain][providerFullName];
    }

    async authProviderChanged(moduleRelativeName, providerName) {
      // change self
      await this._cacheAuthProviderConfig(moduleRelativeName, providerName);
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-auth',
        broadcastName: 'authProviderChanged',
        data: { module: moduleRelativeName, providerName },
      });
    }

    async _cacheAuthProvidersConfig() {
      if (!__authProvidersConfigCache[ctx.subdomain]) {
        __authProvidersConfigCache[ctx.subdomain] = {};
      }
      const authProviders = ctx.bean.base.authProviders();
      for (const key in authProviders) {
        const [module, providerName] = key.split(':');
        await this._cacheAuthProviderConfig(module, providerName);
      }
    }

    async _cacheAuthProviderConfig(module, providerName) {
      if (!__authProvidersConfigCache[ctx.subdomain]) {
        __authProvidersConfigCache[ctx.subdomain] = {};
      }
      // bean
      const providerFullName = `${module}:${providerName}`;
      const beanProvider = this.createAuthProviderBean({
        module,
        providerName,
        providerScene: null,
      });
      // config provider
      const configProviderCache = await this._cacheAuthProviderConfig_provider(module, providerName, beanProvider);
      __authProvidersConfigCache[ctx.subdomain][providerFullName] = configProviderCache;
    }

    async _cacheAuthProviderConfig_provider(module, providerName, beanProvider) {
      const authProvider = beanProvider.authProvider;
      // config default
      const configDefault = await beanProvider.getConfigDefault();
      // provider item
      const providerItem = await ctx.bean.authProvider.getAuthProvider({
        module,
        providerName,
      });
      // combine
      let configProvider;
      if (authProvider.meta.scene) {
        // scene: true
        const itemScenes = providerItem.scenes ? JSON.parse(providerItem.scenes) : null;
        const itemLocales = providerItem.locales ? JSON.parse(providerItem.locales) : null;
        const scenes = extend(true, {}, configDefault && configDefault.scenes, itemScenes);
        const locales = extend(true, {}, configDefault && configDefault.locales, itemLocales);
        configProvider = {
          scenes,
          locales,
        };
      } else {
        // scene: false
        const itemConfig = providerItem.config ? JSON.parse(providerItem.config) : null;
        configProvider = extend(true, {}, configDefault, itemConfig);
      }
      // config provider scenes
      const configProviderScenes = this._cacheAuthProviderConfig_providerScenes(
        configProvider,
        providerItem,
        beanProvider
      );
      return {
        providerItem,
        configProvider,
        configProviderScenes,
      };
    }

    _cacheAuthProviderConfig_providerScenes(configProvider, providerItem, beanProvider) {
      const configProviderScenes = {};
      const authProvider = beanProvider.authProvider;
      if (authProvider.meta.scene) {
        for (const sceneName in configProvider.scenes) {
          const providerScene = configProvider.scenes[sceneName];
          configProviderScenes[sceneName] = this._cacheAuthProviderConfig_providerScene(
            configProvider,
            providerItem,
            beanProvider,
            providerScene
          );
        }
      } else {
        configProviderScenes.default = this._cacheAuthProviderConfig_providerScene(
          configProvider,
          providerItem,
          beanProvider,
          null
        );
      }
      return configProviderScenes;
    }

    _cacheAuthProviderConfig_providerScene(configProvider, providerItem, beanProvider, providerScene) {
      const authProvider = beanProvider.authProvider;
      let configProviderScene;
      if (authProvider.meta.scene) {
        // scene: true
        configProviderScene = { ...providerScene };
      } else {
        configProviderScene = { ...configProvider };
      }
      // providerSceneValid
      configProviderScene.valid =
        !providerItem.disabled && !configProviderScene.disabled && beanProvider.checkConfigValid(configProviderScene);
      // ok
      return configProviderScene;
    }
  }
  return AuthProviderCache;
};
