/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 525:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthProvider {
    get modelAuthProvider() {
      return ctx.model.module(moduleInfo.relativeName).authProvider;
    }
    get localPassport() {
      return ctx.bean.local.module(moduleInfo.relativeName).passport;
    }

    getAuthProviderBase({ module, providerName }) {
      const providerFullName = `${module}:${providerName}`;
      const authProviders = ctx.bean.base.authProviders();
      return authProviders[providerFullName];
    }

    async getAuthProvider({ id, module, providerName }) {
      // ctx.instance maybe not exists
      const data = id ? { id } : { module, providerName };
      const res = await this.modelAuthProvider.get(data);
      if (res) return res;
      if (!module || !providerName) throw new Error('Invalid arguments');
      // lock
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.authProvider.register`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'authProvider',
            context: { module, providerName },
            fn: '_registerAuthProviderLock',
          });
        },
      });
    }

    createAuthProviderBean({ module, providerName, providerScene }) {
      const providerFullName = `${module}:${providerName}`;
      const authProvider = this.getAuthProviderBase({ module, providerName });
      const beanName = authProvider.meta.bean;
      if (!beanName) throw new Error(`auth provider bean not specified: ${providerFullName}`);
      return ctx.bean._newBean(`${beanName.module}.auth.provider.${beanName.name}`, {
        authProvider,
        providerModule: module,
        providerName,
        providerScene: authProvider.meta.scene ? providerScene : null,
      });
    }

    async authenticateDirect({ module, providerName, providerScene, query, body }) {
      return await ctx.meta.util.executeBeanIsolate({
        beanModule: moduleInfo.relativeName,
        beanFullName: `${moduleInfo.relativeName}.local.passport`,
        context: { module, providerName, providerScene },
        fn: 'authenticate',
        ctxParent: {
          session: ctx.session,
          cookies: ctx.cookies,
          user: ctx.user,
          state: ctx.state,
          request: { headers: ctx.headers, query, body },
        },
      });
    }

    _combineAuthenticateUrls({ module, providerName, providerScene }) {
      const authProvider = this.getAuthProviderBase({ module, providerName });
      const urlParamScene = authProvider.meta.scene ? `/${providerScene}` : '';
      return {
        loginURL: `/api/a/auth/passport/${module}/${providerName}${urlParamScene}`,
        callbackURL: `/api/a/auth/passport/${module}/${providerName}${urlParamScene}/callback`,
      };
    }

    async _registerAuthProviderLock({ module, providerName }) {
      // get
      const res = await this.modelAuthProvider.get({ module, providerName });
      if (res) return res;
      // data
      // const _authProviders = ctx.bean.base.authProviders();
      // const _provider = _authProviders[`${module}:${providerName}`];
      // if (!_provider) throw new Error(`authProvider ${module}:${providerName} not found!`);
      const data = {
        module,
        providerName,
        // config: JSON.stringify(_provider.config),
        disabled: 0,
      };
      // insert
      const res2 = await this.modelAuthProvider.insert(data);
      data.id = res2.insertId;
      return data;
    }

    _registerRouters() {
      // url pattern
      const urlPattern = /\/api\/a\/auth\/passport\/(.+)$/;
      // authenticate
      const authenticate = _createAuthenticate();
      // middlewares
      const middlewaresPost = [];
      const middlewaresGet = [];
      if (!ctx.app.meta.isTest) middlewaresPost.push('inner');
      middlewaresPost.push(authenticate);
      middlewaresGet.push(authenticate);
      // mount routes
      const routes = [
        {
          name: 'get:api-a-auth-passport',
          method: 'get',
          path: urlPattern,
          middlewares: middlewaresGet,
          meta: { auth: { enable: false } },
        },
        {
          name: 'post:api-a-auth-passport',
          method: 'post',
          path: urlPattern,
          middlewares: middlewaresPost,
          meta: { auth: { enable: false } },
        },
      ];
      for (const route of routes) {
        ctx.app.meta.router.unRegister(route.name);
        ctx.app.meta.router.register(moduleInfo, route);
      }
    }
  }
  return AuthProvider;
};

function _createAuthenticate() {
  return async function (ctx, next) {
    const urlPattern = ctx.params[0];
    const [module, providerName, providerScene] = urlPattern.split('/');
    ctx.params.module = module;
    ctx.params.providerName = providerName;
    ctx.params.providerScene = providerScene;
    // authenticate
    await ctx.bean.local.module('a-auth').passport.authenticate({
      module,
      providerName,
      providerScene,
      next,
    });
  };
}


/***/ }),

/***/ 602:
/***/ ((module) => {

const __authProvidersConfigCache = {};
const __authProvidersConfigCache_login = {};
const __authProvidersConfigCache_admin = {};

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
  }
  return AuthProviderCache;
};


/***/ }),

/***/ 604:
/***/ ((module) => {

module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      if (!sameAsCaller) {
        await this.ctx.bean.authProviderCache._cacheAuthProviderConfig(data.module, data.providerName);
      }
    }
  }

  return Broadcast;
};


/***/ }),

/***/ 97:
/***/ ((module) => {

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
      return ctx.bean.authProviderCache.getAuthProviderConfigCache(this.providerModule, this.providerName);
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
      return (ctx.app.meta.isTest || ctx.app.meta.isLocal) && ctx.host.indexOf('localhost:') === 0;
    }
    get metaScene() {
      if (this.authProvider.meta.scene) {
        const scene = this.authProvider.scenes && this.authProvider.scenes[this.providerScene];
        return (scene && scene.meta) || this.authProvider.meta;
      }
      return this.authProvider.meta;
    }
  }
  return IAuthProviderBase;
};


/***/ }),

/***/ 963:
/***/ ((module) => {

module.exports = ctx => {
  class Passport {
    async authenticate({ module, providerName, providerScene, next }) {
      const providerFullName = `${module}:${providerName}`;
      const authProvider = ctx.bean.authProvider.getAuthProviderBase({ module, providerName });
      // provider scene
      if (authProvider.meta.scene && !providerScene) {
        throw new Error(`should set provider scene on callback url: ${providerFullName}`);
      }
      // bean
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module,
        providerName,
        providerScene,
      });
      if (!beanProvider.providerSceneValid) ctx.throw.module('a-base', 1015);
      // urls
      const { loginURL, callbackURL } = ctx.bean.authProvider._combineAuthenticateUrls({
        module,
        providerName,
        providerScene,
      });
      // returnTo
      if (ctx.url.indexOf(callbackURL) === -1) {
        if (ctx.request.query && ctx.request.query.returnTo) {
          ctx.session.returnTo = ctx.request.query.returnTo;
          ctx.session['x-scene'] = ctx.bean.util.getFrontScene();
        } else {
          delete ctx.session.returnTo; // force to delete
          delete ctx.session['x-scene'];
        }
      }
      // config
      const config = {};
      config.passReqToCallback = true;
      config.failWithError = false;
      config.loginURL = ctx.bean.base.getAbsoluteUrl(loginURL);
      config.callbackURL = ctx.bean.base.getAbsoluteUrl(callbackURL);
      config.state = ctx.request.query.state;
      config.successRedirect = config.successReturnToOrRedirect =
        beanProvider.metaScene.mode === 'redirect' ? '/' : false;
      // strategy
      const strategy = await _createProviderStrategy(ctx, authProvider, beanProvider);
      // invoke authenticate
      const authenticate = ctx.app.passport.authenticate(strategy, config);
      await authenticate(ctx, next || function () {});
    }
  }
  return Passport;
};

async function _createProviderStrategy(ctx, authProvider, beanProvider) {
  // config
  let config = {};
  config.passReqToCallback = true;
  config.failWithError = false;
  config.successRedirect = config.successReturnToOrRedirect = beanProvider.metaScene.mode === 'redirect' ? '/' : false;
  // combine
  config = ctx.bean.util.extend({}, beanProvider.configProviderScene, config);
  // config.beanProvider = beanProvider;
  // adjust
  config = await beanProvider.adjustConfigForAuthenticate(config);
  // strategy
  const Strategy = beanProvider.getStrategy();
  return new Strategy(config, _createStrategyCallback(beanProvider));
}

function _createStrategyCallback(beanProvider) {
  // req, ...args, done
  return async function (req, ...args) {
    const ctx = req.ctx;
    const done = args[args.length - 1];
    args = args.slice(0, args.length - 1);
    // state: login/associate
    const state = ctx.request.query.state || 'login';
    args.push(state);
    try {
      // onVerify
      const verifyUser = await beanProvider.onVerify(...args);
      if (!verifyUser) {
        done(null, null);
        return;
      }
      // check if verifyUser
      if (verifyUser.op && verifyUser.agent && verifyUser.provider) {
        done(null, verifyUser);
        return;
      }
      // doVerify, because verifyUser is profileUser
      ctx.app.passport.doVerify(req, verifyUser, done);
    } catch (err) {
      done(err, null);
    }
  };
}


/***/ }),

/***/ 977:
/***/ ((module) => {

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache all authProviders
      await this.ctx.bean.authProviderCache._cacheAuthProvidersConfig();
    }
  }

  return Startup;
};


/***/ }),

/***/ 644:
/***/ ((module) => {

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // verify
      app.passport.verify(async (ctx, profileUser) => {
        // state: login/associate
        const state = ctx.request.query.state || 'login';
        // user verify
        return await ctx.bean.user.verify({ state, profileUser });
      });
      // serializeUser
      app.passport.serializeUser(async (ctx, user) => {
        ctx.state.user = user;
        return await ctx.bean.auth.serializeUser({ user });
      });
      // deserializeUser
      app.passport.deserializeUser(async (ctx, user) => {
        if (!ctx.instance) {
          return null;
        }
        if (ctx.state && ctx.state.user) {
          return ctx.bean.auth._pruneUser({ user: ctx.state.user });
        }
        return await ctx.bean.auth.deserializeUser({ user });
      });
    }
  }

  return Startup;
};


/***/ }),

/***/ 36:
/***/ ((module) => {

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // register routers
      await this.ctx.bean.authProvider._registerRouters();
    }
  }

  return Startup;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // aAuthProvider: add scenes
        let sql = `
      ALTER TABLE aAuthProvider
        ADD COLUMN scenes JSON DEFAULT NULL
                `;
        await this.ctx.model.query(sql);
        // aAuth: add providerScene
        sql = `
      ALTER TABLE aAuth
        ADD COLUMN providerScene varchar(255) DEFAULT NULL
                `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const localAuthProviderBase = __webpack_require__(97);
const localPassport = __webpack_require__(963);
const broadcastAuthProviderChanged = __webpack_require__(604);
const startupRegisterPassport = __webpack_require__(644);
const startupRegisterRouters = __webpack_require__(36);
const startupCacheAuthProviders = __webpack_require__(977);
const beanAuthProvider = __webpack_require__(525);
const beanAuthProviderCache = __webpack_require__(602);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.authProviderBase': {
      mode: 'ctx',
      bean: localAuthProviderBase,
    },
    'local.passport': {
      mode: 'ctx',
      bean: localPassport,
    },
    // broadcast
    'broadcast.authProviderChanged': {
      mode: 'app',
      bean: broadcastAuthProviderChanged,
    },
    // startup
    'startup.registerPassport': {
      mode: 'app',
      bean: startupRegisterPassport,
    },
    'startup.registerRouters': {
      mode: 'app',
      bean: startupRegisterRouters,
    },
    'startup.cacheAuthProviders': {
      mode: 'app',
      bean: startupCacheAuthProviders,
    },
    // global
    authProvider: {
      mode: 'ctx',
      bean: beanAuthProvider,
      global: true,
    },
    authProviderCache: {
      mode: 'ctx',
      bean: beanAuthProviderCache,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    registerPassport: {
      bean: 'registerPassport',
    },
    registerRouters: {
      bean: 'registerRouters',
    },
    cacheAuthProviders: {
      bean: 'cacheAuthProviders',
      instance: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    authProviderChanged: {
      bean: 'authProviderChanged',
    },
  };

  // login
  config.login = {
    providers: [
      {
        module: 'a-authsimple',
        provider: 'authsimple',
      },
      {
        module: 'a-authsms',
        provider: 'authsms',
      },
      {
        module: 'a-authgithub',
        provider: 'authgithub',
      },
    ],
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  AuthSelfBuiltApp: 'Self Built App',
  AuthDefault: 'Default',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Auth: '认证',
  AuthSelfBuiltApp: '自建应用',
  AuthDefault: '默认',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 955:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  schemas.oauth2 = {
    type: 'object',
    properties: {
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Auth Info',
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        notEmpty: true,
      },
      clientID: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Client ID',
        notEmpty: true,
      },
      clientSecret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Client Secret',
        notEmpty: true,
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const oauth2 = __webpack_require__(955);

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, oauth2(app));
  return schemas;
};


/***/ }),

/***/ 95:
/***/ ((module) => {

module.exports = app => {
  const controllers = {};
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const IAuthProviderBaseFn = __webpack_require__(97);

module.exports = app => {
  // base
  app.meta.IAuthProviderBase = IAuthProviderBaseFn;

  // aops
  const aops = __webpack_require__(224)(app);
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    aops,
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        oauth2: {
          schemas: 'oauth2',
        },
      },
      keywords: {},
      schemas,
    },
    settings: {
      user: {
        actionPath: '/a/user/user/authentications',
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 848:
/***/ ((module) => {

module.exports = app => {
  class Auth extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuth', options: { disableDeleted: true } });
    }
  }

  return Auth;
};


/***/ }),

/***/ 842:
/***/ ((module) => {

module.exports = app => {
  class AuthProvider extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuthProvider', options: { disableDeleted: true } });
    }
  }

  return AuthProvider;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const auth = __webpack_require__(848);
const authProvider = __webpack_require__(842);

module.exports = app => {
  const models = {
    auth,
    authProvider,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [];
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = app => {
  const services = {};
  return services;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map