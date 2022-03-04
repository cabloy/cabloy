const require3 = require('require3');
const uuid = require3('uuid');
const extend = require3('extend2');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class Auth {
    constructor() {
      this._redisAuth = null;
    }

    get redisAuth() {
      if (!this._redisAuth) {
        this._redisAuth = ctx.app.redis.get('auth') || ctx.app.redis.get('cache');
      }
      return this._redisAuth;
    }

    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      try {
        // check
        await ctx.bean.user.check();
        // logined
        return await this.getLoginInfo({ clientId: true });
      } catch (e) {
        // deleted,disabled
        return await this.logout();
      }
    }

    async check() {
      return await this.getLoginInfo();
    }

    async logout() {
      const user = ctx.state.user;
      await this._clearRedisAuth({ user });
      await ctx.logout();
      await ctx.bean.user.loginAsAnonymous();
      return await this.getLoginInfo();
    }

    async getLoginInfo(options) {
      options = options || {};
      // config
      const config = await this._getConfig();
      const info = {
        user: ctx.state.user,
        instance: this._getInstance(),
        config,
      };
      // clientId
      if (options.clientId === true) {
        info.clientId = uuid.v4().replace(/-/g, '');
      }
      // login info event
      await ctx.bean.event.invoke({
        name: 'loginInfo',
        data: { info },
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
      // instanceConfigsFront
      const instanceConfigsFront = ctx.bean.instance.getInstanceConfigsFront();
      // config
      let config = {
        modules: instanceConfigsFront,
      };
      // config base
      config = extend(true, config, {
        modules: {
          'a-base': {
            account: this._getAccount(),
          },
        },
      });
      // theme
      const themeStatus = `user-theme:${ctx.state.user.agent.id}`;
      const theme = await ctx.bean.status.module('a-user').get(themeStatus);
      if (theme) {
        config.theme = theme;
      }
      // localeModules
      config.localeModules = ctx.bean.base.localeModules();
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
        const [moduleRelativeName, providerName] = key.split(':');
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
        {
          name: `get:${config.loginURL}`,
          method: 'get',
          path: '/' + config.loginURL,
          middlewares: middlewaresGet,
          meta: { auth: { enable: false } },
        },
        {
          name: `post:${config.loginURL}`,
          method: 'post',
          path: '/' + config.loginURL,
          middlewares: middlewaresPost,
          meta: { auth: { enable: false } },
        },
        {
          name: `get:${config.callbackURL}`,
          method: 'get',
          path: '/' + config.callbackURL,
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

    _getAuthRedisKey({ user }) {
      const userAgent = user.agent || user.op;
      return `${ctx.instance.id}:${userAgent.id}:${user.provider.scene || ''}:${user.provider.id}`;
    }

    async serializeUser({ user }) {
      // _user
      const _user = {
        op: { id: user.op.id, iid: user.op.iid, anonymous: user.op.anonymous },
        provider: user.provider,
      };
      if (user.agent.id !== user.op.id) {
        _user.agent = { id: user.agent.id, iid: user.agent.iid, anonymous: user.agent.anonymous };
      }
      // anonymous
      if (user.op.anonymous) {
        // not use redis
        return _user;
      }
      // save to redis
      const key = this._getAuthRedisKey({ user });
      if (!ctx.bean.util.checkDemo(false)) {
        // demo, allowed to auth more times
        _user.token = await this.redisAuth.get(key);
      } else {
        // create a new one
        _user.token = null;
      }
      if (!_user.token) {
        _user.token = uuid.v4().replace(/-/g, '');
      }
      await this.redisAuth.set(key, _user.token, 'PX', ctx.session.maxAge);
      // register user online
      await ctx.bean.userOnline.register({ user });
      // ok
      return _user;
    }

    async deserializeUser({ user }) {
      if (user.op.anonymous) return user;
      // not throw 401: ctx.throw(401);
      if (!user.token) return null;
      // check token
      const key = this._getAuthRedisKey({ user });
      const token = await this.redisAuth.get(key);
      if (token !== user.token) return null;
      // ready
      return user;
    }

    async _clearRedisAuth({ user }) {
      if (!user || user.agent.anonymous) return;
      // redis auth
      const key = this._getAuthRedisKey({ user });
      await this.redisAuth.del(key);
      // should not clear user online
      // await ctx.bean.userOnline.unRegister({ user });
    }
  }

  return Auth;
};

function _createAuthenticate(moduleRelativeName, providerName, _config) {
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
