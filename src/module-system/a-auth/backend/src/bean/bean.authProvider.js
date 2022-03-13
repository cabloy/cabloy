const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthProvider {
    get modelAuthProvider() {
      return ctx.model.module(moduleInfo.relativeName).authProvider;
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
      const authProviders = ctx.bean.base.authProviders();
      const authProvider = authProviders[providerFullName];
      const beanName = authProvider.meta.bean;
      return ctx.bean._newBean(`${beanName.module}.auth.provider.${beanName.name}`, {
        authProvider,
        providerModule: module,
        providerName,
        providerScene,
      });
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

    async _installAuthProviders() {
      // registerAllRouters
      this._registerAllRouters();
      // registerAllStrategies
      await this.registerAllStrategies();
    }

    _registerAllRouters() {
      const authProviders = ctx.bean.base.authProviders();
      for (const key in authProviders) {
        const authProvider = authProviders[key];
        const [moduleRelativeName, providerName] = key.split(':');
        this._registerProviderRouters(moduleRelativeName, providerName, authProvider);
      }
    }

    _registerProviderRouters(moduleRelativeName, providerName, authProvider) {
      // urls
      const moduleInfo = mparse.parseInfo(moduleRelativeName);
      const urlParamScene = authProvider.meta.scene ? '/:providerScene' : '';
      const urls = {
        loginURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}${urlParamScene}`,
        callbackURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}${urlParamScene}/callback`,
      };
      // authenticate
      const authenticate = _createAuthenticate(moduleRelativeName, providerName, authProvider, urls);
      // middlewares
      const middlewaresPost = [];
      const middlewaresGet = [];
      if (!ctx.app.meta.isTest) middlewaresPost.push('inner');
      middlewaresPost.push(authenticate);
      middlewaresGet.push(authenticate);
      // mount routes
      const routes = [
        {
          name: `get:${urls.loginURL}`,
          method: 'get',
          path: '/' + urls.loginURL,
          middlewares: middlewaresGet,
          meta: { auth: { enable: false } },
        },
        {
          name: `post:${urls.loginURL}`,
          method: 'post',
          path: '/' + urls.loginURL,
          middlewares: middlewaresPost,
          meta: { auth: { enable: false } },
        },
        {
          name: `get:${urls.callbackURL}`,
          method: 'get',
          path: '/' + urls.callbackURL,
          middlewares: middlewaresGet,
          meta: { auth: { enable: false } },
        },
        // { name: `post:${config.callbackURL}`, method: 'post', path: '/' + config.callbackURL, middlewares, meta: { auth: { enable: false } } },
      ];
      for (const route of routes) {
        ctx.app.meta.router.unRegister(route.name);
        ctx.app.meta.router.register(moduleInfo, route);
      }
    }

    async registerAllStrategies() {
      const authProviders = ctx.bean.base.authProviders();
      for (const key in authProviders) {
        const authProvider = authProviders[key];
        const [moduleRelativeName, providerName] = key.split(':');
        this._registerProviderStrategy(moduleRelativeName, providerName, authProvider);
      }
    }

    async _registerProviderStrategy(moduleRelativeName, providerName, authProvider) {
      // strategy
      const strategyName = `${moduleRelativeName}:${providerName}`;
      // bean
      const beanProvider = this.createAuthProviderBean({
        module: moduleRelativeName,
        providerName,
        providerScene: null,
      });
      const Strategy = beanProvider.getStrategy();
      // config
      const config = {};
      config.passReqToCallback = true;
      config.failWithError = false;
      config.successRedirect = config.successReturnToOrRedirect = authProvider.meta.mode === 'redirect' ? '/' : false;
      // use strategy
      ctx.app.passport.use(
        strategyName,
        new Strategy(config, _createStrategyCallback(moduleRelativeName, providerName, authProvider))
      );
    }
  }
  return AuthProvider;
};

function _createStrategyCallback(moduleRelativeName, providerName, authProvider) {
  // req, ...args, done
  return async function (req, ...args) {
    const ctx = req.ctx;
    const done = args[args.length - 1];
    args = args.slice(0, args.length - 1);
    try {
      const providerFullName = `${moduleRelativeName}:${providerName}`;
      // provider scene
      const providerScene = ctx.params.scene;
      if (authProvider.meta.scene && !providerScene) {
        throw new Error(`should set provider scene on callback url: ${providerFullName}`);
      }
      // bean
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: moduleRelativeName,
        providerName,
        providerScene,
      });
      beanProvider.loadConfigScene();
      if (!beanProvider.providerSceneValid) ctx.throw(423);
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

function _createAuthenticate(moduleRelativeName, providerName, authProvider, urls) {
  return async function (ctx, next) {
    const providerFullName = `${moduleRelativeName}:${providerName}`;
    // provider scene
    const providerScene = ctx.params.scene;
    if (authProvider.meta.scene && !providerScene) {
      throw new Error(`should set provider scene on callback url: ${providerFullName}`);
    }
    // bean
    const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
      module: moduleRelativeName,
      providerName,
      providerScene,
    });
    beanProvider.loadConfigScene();
    if (!beanProvider.providerSceneValid) ctx.throw(423);
    // urls
    const loginURL = authProvider.meta.scene ? urls.loginURL.replace(':providerScene', providerScene) : urls.loginURL;
    const callbackURL = authProvider.meta.scene
      ? urls.callbackURL.replace(':providerScene', providerScene)
      : urls.callbackURL;
    // returnTo

    if (ctx.url.indexOf(callbackURL) === -1) {
      if (ctx.request.query && ctx.request.query.returnTo) {
        ctx.session.returnTo = ctx.request.query.returnTo;
        ctx.session['x-scene'] = ctx.request.query['x-scene'];
      } else {
        delete ctx.session.returnTo; // force to delete
        delete ctx.session['x-scene'];
      }
    }

    // config
    let config = {};
    config.passReqToCallback = true;
    config.failWithError = false;
    config.loginURL = ctx.bean.base.getAbsoluteUrl(loginURL);
    config.callbackURL = ctx.bean.base.getAbsoluteUrl(callbackURL);
    config.state = ctx.request.query.state;
    config.successRedirect = config.successReturnToOrRedirect = authProvider.meta.mode === 'redirect' ? '/' : false;
    config.beanProvider = beanProvider;
    // combine
    config = extend(true, {}, beanProvider.configProviderScene, config);
    // invoke authenticate
    const strategyName = providerFullName;
    const authenticate = ctx.app.passport.authenticate(strategyName, config);
    await authenticate(ctx, next);
  };
}
