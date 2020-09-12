const require3 = require('require3');
const extend = require3('extend2');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {

  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class Auth {
    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      try {
        // check
        await ctx.bean.user.check();
        // logined
        return await this.getLoginInfo();
      } catch (e) {
        // deleted,disabled
        return await this.logout();
      }
    }

    async check() {
      return await this.getLoginInfo();
    }

    async logout() {
      await ctx.logout();
      await ctx.bean.user.loginAsAnonymous();
      return await this.getLoginInfo();
    }

    async getLoginInfo() {
      const config = await this._getConfig();
      const info = {
        user: ctx.state.user,
        instance: this._getInstance(),
        config,
      };
      // login info event
      await ctx.bean.event.invoke({
        name: 'loginInfo', data: { info },
      });
      return info;
    }

    _getInstance() {
      return {
        name: ctx.instance.name,
        title: ctx.instance.title,
      };
    }

    async _getConfig() {
      // config
      const config = {
        modules: {
          'a-base': {
            account: this._getAccount(),
          },
        },
      };
      // theme
      const themeStatus = `user-theme:${ctx.state.user.agent.id}`;
      const theme = await ctx.bean.status.module('a-user').get(themeStatus);
      if (theme) {
        config.theme = theme;
      }
      // ok
      return config;
    }

    _getAccount() {
      // account
      const account = extend(true, {}, ctx.config.module(moduleInfo.relativeName).account);
      account.activatedRoles = undefined;
      // url
      for (const key in account.activationProviders) {
        const relativeName = account.activationProviders[key];
        if (relativeName) {
          const moduleConfig = ctx.config.module(relativeName);
          extend(true, account.url, moduleConfig.account.url);
        }
      }
      return account;
    }

    async _installAuthProviders() {
      // registerAllRouters
      this._registerAllRouters();
      // registerAllProviders
      await this._registerAllProviders();
    }

    _registerAllRouters() {
      const authProviders = ctx.bean.base.authProviders();
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
      const authenticate = _createAuthenticate(moduleRelativeName, providerName, config);
      // middlewares
      const middlewaresPost = [];
      const middlewaresGet = [];
      if (!ctx.app.meta.isTest) middlewaresPost.push('inner');
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
        const [ moduleRelativeName, providerName ] = key.split(':');
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
          config.successRedirect = config.successReturnToOrRedirect = (provider.meta.mode === 'redirect') ? '/' : false;
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

  return Auth;
};

function _createAuthenticate(moduleRelativeName, providerName, _config) {
  return async function(ctx, next) {
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
      } else {
        delete ctx.session.returnTo; // force to delete
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

