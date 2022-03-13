const require3 = require('require3');
const extend = require3('extend2');

const __authProvidersConfigCache = {};
const __authProvidersConfigCache_login = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthProviderCache {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    getAuthProvidersConfigCache() {
      return __authProvidersConfigCache[ctx.subdomain];
    }

    getAuthProviderConfigCache(module, providerName) {
      const providerFullName = `${module}:${providerName}`;
      return __authProvidersConfigCache[ctx.subdomain][providerFullName];
    }

    getAuthProvidersConfigForLogin() {
      if (!__authProvidersConfigCache_login[ctx.subdomain]) {
        __authProvidersConfigCache_login[ctx.subdomain] = {};
      }
      if (!__authProvidersConfigCache_login[ctx.subdomain][ctx.locale]) {
        __authProvidersConfigCache_login[ctx.subdomain][ctx.locale] = {};
      }
      let providersConfigForLogin = __authProvidersConfigCache_login[ctx.subdomain][ctx.locale];
      if (!providersConfigForLogin) {
        const listMap = this._getAuthProvidersConfigForLogin_list();
        providersConfigForLogin = this._getAuthProvidersConfigForLogin_order(listMap);
        __authProvidersConfigCache_login[ctx.subdomain][ctx.locale] = providersConfigForLogin;
      }
      return providersConfigForLogin;
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

    _getAuthProvidersConfigForLogin_list() {
      const listMap = {};
      //
      const providersConfigCache = this.getAuthProviderConfigCache();
      for (const providerFullName in providersConfigCache) {
        const providerConfigCache = providersConfigCache[providerFullName];
        const providerConfigForLogin = this._getAuthProviderConfigForLogin(providerFullName, providerConfigCache);
        if (providerConfigForLogin) {
          listMap[providerFullName] = providerConfigForLogin;
        }
      }
      return listMap;
    }

    _getAuthProvidersConfigForLogin_order(listMap) {
      const list = [];
      for (const item of this.configModule.login.providers) {
        const key = `${item.module}:${item.provider}`;
        const provider = listMap[key];
        if (provider) {
          list.push(provider);
          delete listMap[key];
        }
      }
      // the rest
      for (const key in listMap) {
        list.push(listMap[key]);
      }
      return list;
    }

    _getAuthProviderConfigForLogin(providerFullName, providerConfigCache) {
      const authProviders = ctx.bean.base.authProviders();
      const authProvider = authProviders[providerFullName];
      const providerConfigForLogin = {
        title: ctx.text(authProvider.meta.title),
        meta: authProvider.meta,
        scenes: {},
      };
      const { configProvider, configProviderScenes } = providerConfigCache;
      for (const sceneName in configProviderScenes) {
        const configProviderScene = configProviderScenes[sceneName];
        if (configProviderScene.__valid) {
          providerConfigForLogin.scenes[sceneName] = {
            title: configProviderScene.title,
            titleLocale: ctx.bean.util.getTitleLocale({
              locales: configProvider.locales,
              title: configProviderScene.title,
            }),
          };
        }
      }
      if (Object.keys(providerConfigForLogin.scenes).length === 0) return null;
      return providerConfigForLogin;
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
      // clear login cache, because some provider changed
      __authProvidersConfigCache_login[ctx.subdomain] = {};
      //
      if (!__authProvidersConfigCache[ctx.subdomain]) {
        __authProvidersConfigCache[ctx.subdomain] = {};
      }
      // bean
      const providerFullName = `${module}:${providerName}`;
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
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
      configProviderScene.__valid =
        !providerItem.disabled && !configProviderScene.disabled && beanProvider.checkConfigValid(configProviderScene);
      // ok
      return configProviderScene;
    }
  }
  return AuthProviderCache;
};
