const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = app => {

  class Auth extends app.Service {

    // register all authProviders
    async registerAllProviders() {
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.auth && module.main.meta.auth.providers) {
          for (const providerName in module.main.meta.auth.providers) {
            await this.registerProviderInstances(module.info.relativeName, providerName);
          }
        }
      }
    }

    async registerProviderInstances(moduleRelativeName, providerName) {
      // all instances
      const instances = await this.ctx.model.query('select * from aInstance a where a.disabled=0');
      for (const instance of instances) {
        await this.registerProviderInstance(instance.id, moduleRelativeName, providerName);
      }
      // config
      const moduleInfo = mparse.parseInfo(moduleRelativeName);
      const config = {
        loginURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}`,
        callbackURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}/callback`,
      };
      // authenticate
      const authenticate = createAuthenticate(moduleRelativeName, providerName, config);
      // mount routes
      const routes = [
        { name: `get:${config.loginURL}`, method: 'get', path: '/' + config.loginURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
        { name: `post:${config.loginURL}`, method: 'post', path: '/' + config.loginURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
        { name: `get:${config.callbackURL}`, method: 'get', path: '/' + config.callbackURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
        { name: `post:${config.callbackURL}`, method: 'post', path: '/' + config.callbackURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
      ];
      for (const route of routes) {
        this.app.meta.router.unRegister(route.name);
        this.app.meta.router.register(moduleInfo, route);
      }
    }

    async registerProviderInstance(iid, moduleRelativeName, providerName) {
      // provider of db
      const providerItem = await this.ctx.db.get('aAuthProvider', {
        iid,
        module: moduleRelativeName,
        providerName,
      });
      if (providerItem && providerItem.disabled === 0) {
        // config
        const config = JSON.parse(providerItem.config);
        config.passReqToCallback = true;
        config.failWithError = false;
        // module
        const module = this.app.meta.modules[moduleRelativeName];
        // provider
        const provider = module.main.meta.auth.providers[providerName](this.app);
        // install strategy
        const strategyName = `${iid}:${moduleRelativeName}:${providerName}`;
        this.app.passport.unuse(strategyName);
        this.app.passport.use(strategyName, new provider.strategy(config, provider.callback));
      }
    }

  }

  return Auth;
};

function createAuthenticate(moduleRelativeName, providerName, _config) {
  return async function(ctx, next) {
    // provider of db
    const providerItem = await ctx.model.authProvider.get({
      module: moduleRelativeName,
      providerName,
    });
    if (!providerItem || providerItem.disabled !== 0) ctx.throw(423);

    // returnTo
    if (ctx.request.query && ctx.request.query.returnTo) {
      ctx.session.returnTo = ctx.request.query.returnTo;
    } else {
      delete ctx.session.returnTo; // force to delete
    }

    // config
    const config = JSON.parse(providerItem.config);
    config.passReqToCallback = true;
    config.failWithError = false;
    config.loginURL = _config.loginURL;
    config.callbackURL = _config.callbackURL;
    config.state = ctx.request.query.state;

    // invoke authenticate
    const strategyName = `${ctx.instance.id}:${moduleRelativeName}:${providerName}`;
    const authenticate = ctx.app.passport.authenticate(strategyName, config);
    await authenticate(ctx, next);
  };
}

