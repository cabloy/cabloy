const require3 = require('require3');
const Strategy = require3('@zhennann/passport-wechat').Strategy;

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get cacheDb() {
      return ctx.cache.db.module(moduleInfo.relativeName);
    }
    async getConfigDefault() {
      return this.configModule.account.wechat;
    }
    checkConfigValid(config) {
      return !!config.appID && !!config.appSecret;
    }
    async adjustConfig(config) {
      function getCacheKey(openid) {
        return `wechat-webtoken:wechat:${openid}`;
      }
      config.getToken = (openid, cb) => {
        this.cacheDb
          .get(getCacheKey(openid))
          .then(token => cb(null, token))
          .catch(cb);
      };
      config.saveToken = (openid, token, cb) => {
        this.cacheDb
          .set(getCacheKey(openid), token, (token.expires_in - 10) * 1000)
          .then(() => cb(null))
          .catch(cb);
      };
      return config;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(accessToken, refreshToken, userInfo) {
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
