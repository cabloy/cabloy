const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;
const UserFn = require('../config/middleware/adapter/user.js');

module.exports = app => {

  class Auth extends app.Service {

    // register all authProviders
    async installAuthProviders() {
      // registerAllRouters
      this._registerAllRouters();
      // registerAllProviders
      await this._registerAllProviders();
    }

    _registerAllRouters() {
      const authProviders = this.ctx.meta.util.authProviders();
      for (const key in authProviders) {
        const [ moduleRelativeName, providerName ] = key.split(':');
        this._registerProviderRouters(moduleRelativeName, providerName);
      }
    }

    _registerProviderRouters(moduleRelativeName, providerName) {
      // config
      const moduleInfo = mparse.parseInfo(moduleRelativeName);
      const config = {
        loginURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}`,
        callbackURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}/callback`,
      };
      // authenticate
      const authenticate = createAuthenticate(moduleRelativeName, providerName, config);
      // middlewares
      const middlewaresPost = [];
      const middlewaresGet = [];
      if (!this.ctx.app.meta.isTest) middlewaresPost.push('inner');
      middlewaresPost.push(authenticate);
      middlewaresGet.push(authenticate);
      // mount routes
      const routes = [
        { name: `get:${config.loginURL}`, method: 'get', path: '/' + config.loginURL, middlewares: middlewaresGet, meta: { auth: { enable: false } } },
        { name: `post:${config.loginURL}`, method: 'post', path: '/' + config.loginURL, middlewares: middlewaresPost, meta: { auth: { enable: false } } },
        { name: `get:${config.callbackURL}`, method: 'get', path: '/' + config.callbackURL, middlewares: middlewaresGet, meta: { auth: { enable: false } } },
        // { name: `post:${config.callbackURL}`, method: 'post', path: '/' + config.callbackURL, middlewares, meta: { auth: { enable: false } } },
      ];
      for (const route of routes) {
        this.app.meta.router.unRegister(route.name);
        this.app.meta.router.register(moduleInfo, route);
      }
    }

    async _registerAllProviders() {
      // all instances
      const instances = await this.ctx.model.query('select * from aInstance a where a.disabled=0');
      for (const instance of instances) {
        await this._registerInstanceProviders(instance.name, instance.id);
      }
    }

    async _registerInstanceProviders(subdomain, iid) {
      const authProviders = this.ctx.meta.util.authProviders();
      for (const key in authProviders) {
        const [ moduleRelativeName, providerName ] = key.split(':');
        await this._registerInstanceProvider(subdomain, iid, moduleRelativeName, providerName);
      }
    }

    async _registerInstanceProvider(subdomain, iid, moduleRelativeName, providerName) {
      // provider of db
      const user = new (UserFn(this.ctx))();
      const providerItem = await user.getAuthProvider({
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
        const authProviders = this.ctx.meta.util.authProviders();
        const provider = authProviders[`${moduleRelativeName}:${providerName}`];
        if (provider.handler) {
          // config
          const config = JSON.parse(providerItem.config);
          config.passReqToCallback = true;
          config.failWithError = false;
          config.successRedirect = config.successReturnToOrRedirect = (provider.meta.mode === 'redirect') ? '/' : false;
          // handler
          const handler = provider.handler(this.app);
          // use strategy
          this.app.passport.unuse(strategyName);
          this.app.passport.use(strategyName, new handler.strategy(config, handler.callback));
        }
      } else {
        // unuse strategy
        this.app.passport.unuse(strategyName);
      }
    }

    async register({ module, providerName }) {
      return await this.ctx.meta.user.registerAuthProvider({ module, providerName });
    }

    async providerChanged({ module, providerName }) {
      await this._registerInstanceProvider(this.ctx.subdomain, this.ctx.instance.id, module, providerName);
    }

  }

  return Auth;
};

function createAuthenticate(moduleRelativeName, providerName, _config) {
  return async function(ctx, next) {
    // provider of db
    const providerItem = await ctx.meta.user.getAuthProvider({
      module: moduleRelativeName,
      providerName,
    });
    if (!providerItem || providerItem.disabled !== 0) ctx.throw(423);

    // returnTo
    if (ctx.url.indexOf(_config.callbackURL) === -1) {
      if (ctx.request.query && ctx.request.query.returnTo) {
        ctx.session.returnTo = ctx.request.query.returnTo;
      } else {
        delete ctx.session.returnTo; // force to delete
      }
    }

    // provider
    const authProviders = ctx.meta.util.authProviders();
    const provider = authProviders[`${moduleRelativeName}:${providerName}`];

    // config
    const config = JSON.parse(providerItem.config);
    config.passReqToCallback = true;
    config.failWithError = false;
    config.loginURL = ctx.meta.base.getAbsoluteUrl(_config.loginURL);
    config.callbackURL = ctx.meta.base.getAbsoluteUrl(_config.callbackURL);
    config.state = ctx.request.query.state;
    config.successRedirect = config.successReturnToOrRedirect = (provider.meta.mode === 'redirect') ? '/' : false;

    // config functions
    if (provider.configFunctions) {
      for (const key in provider.configFunctions) {
        config[key] = function(...args) {
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

