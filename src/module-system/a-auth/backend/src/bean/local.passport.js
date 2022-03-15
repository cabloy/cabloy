const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  class Passport {
    async authenticate({ module, providerName, providerScene, next }) {
      const providerFullName = `${module}:${providerName}`;
      const authProviders = ctx.bean.base.authProviders();
      const authProvider = authProviders[providerFullName];
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
      if (!beanProvider.providerSceneValid) ctx.throw(423);
      // urls
      const urls = this._combineAuthenticateUrls({
        module,
        providerName,
        authProvider,
      });
      const loginURL = authProvider.meta.scene ? urls.loginURL.replace(':providerScene', providerScene) : urls.loginURL;
      const callbackURL = authProvider.meta.scene
        ? urls.callbackURL.replace(':providerScene', providerScene)
        : urls.callbackURL;
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
      config.successRedirect = config.successReturnToOrRedirect = authProvider.meta.mode === 'redirect' ? '/' : false;
      // strategy
      const strategy = _createProviderStrategy(authProvider, beanProvider);
      // invoke authenticate
      const authenticate = ctx.app.passport.authenticate(strategy, config);
      await authenticate(ctx, next || function () {});
    }

    _combineAuthenticateUrls({ module, providerName, authProvider }) {
      const urlParamScene = authProvider.meta.scene ? '/:providerScene' : '';
      return {
        loginURL: `/api/a/auth/passport/${module}/${providerName}${urlParamScene}`,
        callbackURL: `/api/a/auth/passport/${module}/${providerName}${urlParamScene}/callback`,
      };
    }
  }
  return Passport;
};

function _createProviderStrategy(authProvider, beanProvider) {
  // config
  let config = {};
  config.passReqToCallback = true;
  config.failWithError = false;
  config.successRedirect = config.successReturnToOrRedirect = authProvider.meta.mode === 'redirect' ? '/' : false;
  config.beanProvider = beanProvider;
  // combine
  config = extend(true, {}, beanProvider.configProviderScene, config);
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
