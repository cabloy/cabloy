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
