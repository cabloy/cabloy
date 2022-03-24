const Strategy = require('../config/passport/strategy-dingtalk.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get localHelper() {
      return ctx.bean.local.module(moduleInfo.relativeName).helper;
    }
    async getConfigDefault() {
      return this.configModule.account.dingtalkadmin;
    }
    checkConfigValid(config) {
      return !!config.corpId && !!config.ssoSecret;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(code, state) {
      // code/memberId
      const res = await ctx.bean.dingtalk.admin.oauth2.getSsoUserInfo({ code });
      const memberId = res.user_info.userId;
      const verifyUser = await this.localHelper.verifyAuthUser({
        beanProvider: this,
        memberId,
        state,
        needLogin: false,
      });
      return verifyUser;
    }
  }

  return Provider;
};
