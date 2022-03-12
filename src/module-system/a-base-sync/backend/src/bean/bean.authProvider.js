const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthProvider {
    async _installAuthProviders() {
      // registerAllRouters
      this._registerAllRouters();
      // registerAllProviders
      await this._registerAllProviders();
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

    async _registerAllProviders() {
      await this._registerInstanceProviders(ctx.instance.name, ctx.instance.id);
    }

    async _registerInstanceProviders(subdomain, iid) {
      const authProviders = ctx.bean.base.authProviders();
      for (const key in authProviders) {
        const [moduleRelativeName, providerName] = key.split(':');
        await this._registerInstanceProvider(subdomain, iid, moduleRelativeName, providerName);
      }
    }

    async _registerInstanceProvider(subdomain, iid, moduleRelativeName, providerName) {
      // provider of db
      const providerItem = await ctx.bean.user.getAuthProvider({
        subdomain,
        iid,
        module: moduleRelativeName,
        providerName,
      });
      if (!providerItem) return;
      // strategy
      const strategyName = `${iid}:${moduleRelativeName}:${providerName}`;
      // unuse/use
      if (providerItem.disabled === 0) {
        // provider
        const authProviders = ctx.bean.base.authProviders();
        const provider = authProviders[`${moduleRelativeName}:${providerName}`];
        if (provider.handler) {
          // config
          const config = provider.config;
          config.passReqToCallback = true;
          config.failWithError = false;
          config.successRedirect = config.successReturnToOrRedirect = provider.meta.mode === 'redirect' ? '/' : false;
          // handler
          const handler = provider.handler(ctx.app);
          // use strategy
          ctx.app.passport.unuse(strategyName);
          ctx.app.passport.use(strategyName, new handler.strategy(config, handler.callback));
        }
      } else {
        // unuse strategy
        ctx.app.passport.unuse(strategyName);
      }
    }
  }
  return AuthProvider;
};

function _createAuthenticate(moduleRelativeName, providerName, authProvider, urls) {
  return async function (ctx, next) {
    // provider of db
    const providerItem = await ctx.bean.user.getAuthProvider({
      module: moduleRelativeName,
      providerName,
    });
    if (!providerItem || providerItem.disabled !== 0) ctx.throw(423);

    // returnTo
    if (ctx.url.indexOf(_config.callbackURL) === -1) {
      if (ctx.request.query && ctx.request.query.returnTo) {
        ctx.session.returnTo = ctx.request.query.returnTo;
        ctx.session['x-scene'] = ctx.request.query['x-scene'];
      } else {
        delete ctx.session.returnTo; // force to delete
        delete ctx.session['x-scene'];
      }
    }

    // provider
    const authProviders = ctx.bean.base.authProviders();
    const provider = authProviders[`${moduleRelativeName}:${providerName}`];

    // config
    const config = provider.config;
    config.passReqToCallback = true;
    config.failWithError = false;
    config.loginURL = ctx.bean.base.getAbsoluteUrl(_config.loginURL);
    config.callbackURL = ctx.bean.base.getAbsoluteUrl(_config.callbackURL);
    config.state = ctx.request.query.state;
    config.successRedirect = config.successReturnToOrRedirect = provider.meta.mode === 'redirect' ? '/' : false;

    // config functions
    if (provider.configFunctions) {
      for (const key in provider.configFunctions) {
        config[key] = function (...args) {
          return provider.configFunctions[key](ctx, ...args);
        };
      }
    }

    // invoke authenticate
    const strategyName = `${ctx.instance.id}:${moduleRelativeName}:${providerName}`;
    const authenticate = ctx.app.passport.authenticate(strategyName, config);
    await authenticate(ctx, next);
  };
}
