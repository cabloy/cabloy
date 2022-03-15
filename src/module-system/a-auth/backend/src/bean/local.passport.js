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
