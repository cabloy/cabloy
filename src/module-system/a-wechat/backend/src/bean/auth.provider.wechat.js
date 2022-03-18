const require3 = require('require3');
const Strategy = require3('@zhennann/passport-wechat').Strategy;

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    async getConfigDefault() {
      const configGitHub = this.configModule.account.github;
      return {
        scenes: configGitHub.scenes,
        locales: configGitHub.locales,
      };
    }
    checkConfigValid(config) {
      return !!config.clientID && !!config.clientSecret;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(accessToken, refreshToken, userInfo, expires_in) {
      const ctx = req.ctx;
      const state = ctx.request.query.state || 'login';
      const wechatHelper = new (WechatHelperFn(ctx))();
      wechatHelper
        .verifyAuthUser({
          scene: sceneInfo.scene,
          openid: userInfo.openid,
          userInfo,
          state,
          cbVerify: (profileUser, cb) => {
            app.passport.doVerify(req, profileUser, cb);
          },
        })
        .then(verifyUser => {
          done(null, verifyUser);
        })
        .catch(done);
    }
  }

  return Provider;
};
