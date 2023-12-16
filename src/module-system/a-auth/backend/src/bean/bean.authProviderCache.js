const __authProvidersConfigCache = {};
const __authProvidersConfigCache_login = {};
const __authProvidersConfigCache_admin = {};

const moduleInfo = module.info;

module.exports = class AuthProviderCache {
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
    let providersConfigForLogin = __authProvidersConfigCache_login[ctx.subdomain][ctx.locale];
    if (!providersConfigForLogin) {
      const listMap = this._getAuthProvidersConfigForLogin_list({ forLogin: true });
      if (!listMap) return null; // for try to get info at next time
      providersConfigForLogin = this._getAuthProvidersConfigForLogin_order(listMap);
      __authProvidersConfigCache_login[ctx.subdomain][ctx.locale] = providersConfigForLogin;
    }
    return providersConfigForLogin;
  }

  getAuthProvidersConfigForAdmin() {
    if (!__authProvidersConfigCache_admin[ctx.subdomain]) {
      __authProvidersConfigCache_admin[ctx.subdomain] = {};
    }
    let providersConfigForAdmin = __authProvidersConfigCache_admin[ctx.subdomain][ctx.locale];
    if (!providersConfigForAdmin) {
      const listMap = this._getAuthProvidersConfigForLogin_list({ forLogin: false });
      if (!listMap) return null; // for try to get info at next time
      providersConfigForAdmin = this._getAuthProvidersConfigForLogin_order(listMap);
      __authProvidersConfigCache_admin[ctx.subdomain][ctx.locale] = providersConfigForAdmin;
    }
    return providersConfigForAdmin;
  }

  async authProviderChanged({ module, providerName }) {
    // change self
    await this._cacheAuthProviderConfig(module, providerName);
    // broadcast
    ctx.meta.util.broadcastEmit({
      module: 'a-auth',
      broadcastName: 'authProviderChanged',
      data: { module, providerName },
    });
  }

  purgeScene(scene) {
    const res = ctx.bean.util.extend({}, scene);
    delete res.__valid;
    delete res.titleLocale;
    return res;
  }

  _getAuthProvidersConfigForLogin_list({ forLogin }) {
    const listMap = {};
    //
    const providersConfigCache = this.getAuthProvidersConfigCache();
    for (const providerFullName in providersConfigCache) {
      const providerConfigCache = providersConfigCache[providerFullName];
      const providerConfigForLogin = this._getAuthProviderConfigForLogin(
        providerFullName,
        providerConfigCache,
        forLogin
      );
      if (providerConfigForLogin) {
        listMap[providerFullName] = providerConfigForLogin;
      }
    }
    if (Object.keys(listMap).length === 0) return null;
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

  _getAuthProviderConfigForLogin(providerFullName, providerConfigCache, forLogin) {
    const [module, providerName] = providerFullName.split(':');
    const authProvider = ctx.bean.authProvider.getAuthProviderBase({ module, providerName });
    const { providerItem, configProviderScenes } = providerConfigCache;
    const providerConfigForLogin = {
      module,
      providerName,
      meta: authProvider.meta,
      metaScenes: authProvider.scenes,
      scenes: {},
    };
    if (!forLogin) {
      // admin
      providerConfigForLogin.providerItem = providerItem;
    }
    for (const sceneName in configProviderScenes) {
      const configProviderScene = configProviderScenes[sceneName];
      const titleLocale = ctx.text(configProviderScene.title);
      if (forLogin) {
        // login
        if (configProviderScene.__valid) {
          providerConfigForLogin.scenes[sceneName] = {
            title: configProviderScene.title,
            titleLocale,
          };
        }
      } else {
        // admin
        providerConfigForLogin.scenes[sceneName] = {
          ...configProviderScene,
          titleLocale,
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
    __authProvidersConfigCache_admin[ctx.subdomain] = {};
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
    // config provider scenes
    await this._cacheAuthProviderConfig_providerScenes(configProviderCache, beanProvider);
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
      const scenes = ctx.bean.util.extend({}, configDefault && configDefault.scenes, itemScenes);
      configProvider = {
        scenes,
      };
    } else {
      // scene: false
      const itemConfig = providerItem.config ? JSON.parse(providerItem.config) : null;
      configProvider = ctx.bean.util.extend({}, configDefault, itemConfig);
    }
    return {
      authProvider,
      providerItem,
      configProvider,
      configProviderScenes: {},
    };
  }

  async _cacheAuthProviderConfig_providerScenes(configProviderCache, beanProvider) {
    const { configProviderScenes, configProvider, providerItem } = configProviderCache;
    const authProvider = beanProvider.authProvider;
    if (authProvider.meta.scene) {
      for (const sceneName in configProvider.scenes) {
        const providerScene = configProvider.scenes[sceneName];
        configProviderScenes[sceneName] = await this._cacheAuthProviderConfig_providerScene(
          configProvider,
          providerItem,
          beanProvider,
          providerScene,
          sceneName
        );
      }
    } else {
      configProviderScenes.default = await this._cacheAuthProviderConfig_providerScene(
        configProvider,
        providerItem,
        beanProvider,
        null,
        null
      );
    }
    return configProviderScenes;
  }

  async _cacheAuthProviderConfig_providerScene(configProvider, providerItem, beanProvider, providerScene, sceneName) {
    //
    const authProvider = beanProvider.authProvider;
    // create new beanProvider as providerScene specified
    if (authProvider.meta.scene) {
      beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: beanProvider.providerModule,
        providerName: beanProvider.providerName,
        providerScene: sceneName,
      });
    }
    //
    let configProviderScene;
    if (authProvider.meta.scene) {
      // scene: true
      configProviderScene = { ...providerScene };
    } else {
      configProviderScene = { ...configProvider };
    }
    // adjustConfigForCache
    configProviderScene = await beanProvider.adjustConfigForCache(configProviderScene);
    // providerSceneValid
    configProviderScene.__valid =
      !providerItem.disabled && !configProviderScene.disabled && beanProvider.checkConfigValid(configProviderScene);
    // ok
    return configProviderScene;
  }
};
