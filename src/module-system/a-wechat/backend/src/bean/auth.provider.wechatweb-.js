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
    get localHelper() {
      return ctx.bean.local.module(moduleInfo.relativeName).helper;
    }
    async getConfigDefault() {
      return this.configModule.account.wechatweb;
    }
    checkConfigValid(config) {
      return !!config.appID && !!config.appSecret;
    }
    async adjustConfigForAuthenticate(config) {
      function getCacheKey(openid) {
        return `wechat-webtoken:wechatweb:${openid}`;
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
    async onVerify(accessToken, refreshToken, userInfo, expires_in, state) {
      const verifyUser = await this.localHelper.verifyAuthUser({
        beanProvider: this,
        openid: userInfo.openid,
        userInfo,
        state,
        needLogin: false,
      });
      return verifyUser;
    }
  }

  return Provider;
};
