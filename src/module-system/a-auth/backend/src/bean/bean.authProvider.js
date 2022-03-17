const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

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

    _combineAuthenticateUrlPatterns({ module, providerName }) {
      const authProvider = this.getAuthProviderBase({ module, providerName });
      const urlParamScene = authProvider.meta.scene ? '/:providerScene' : '';
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

    async _installAuthProviders() {
      // registerAllRouters
      this._registerAllRouters();
    }

    _registerAllRouters() {
      const authProviders = ctx.bean.base.authProviders();
      for (const key in authProviders) {
        const [moduleRelativeName, providerName] = key.split(':');
        this._registerProviderRouters(moduleRelativeName, providerName);
      }
    }

    _registerProviderRouters(moduleRelativeName, providerName) {
      // urls
      const moduleInfo = mparse.parseInfo(moduleRelativeName);
      const urls = this._combineAuthenticateUrlPatterns({
        module: moduleRelativeName,
        providerName,
      });
      // authenticate
      const authenticate = _createAuthenticate(moduleRelativeName, providerName);
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
  }
  return AuthProvider;
};

function _createAuthenticate(moduleRelativeName, providerName) {
  return async function (ctx, next) {
    // provider scene
    const providerScene = ctx.params.providerScene;
    await ctx.bean.local.module('a-auth').passport.authenticate({
      module: moduleRelativeName,
      providerName,
      providerScene,
      next,
    });
  };
}
