const require3 = require('require3');
const extend = require3('extend2');
const Strategy = require('../config/passport/strategy-wxwork.js');

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
      const configWxworkweb = this.configModule.account.wxworkweb;
      return {
        scenes: configWxworkweb.scenes,
        locales: configWxworkweb.locales,
      };
    }
    checkConfigValid(config) {
      return !!config.corpId && !!config.corpSecret && config.agentId;
    }
    async adjustConfigForCache(config) {
      // from wxwork
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: this.providerModule,
        providerName: this.providerName,
        providerScene: this.providerScene,
      });
      // config should be the last, as maybe disabled
      config = extend(true, {}, beanProvider.configProviderScene, config);
      // ok
      return config;
    }
    async adjustConfigForAuthenticate(config) {
      const configWxworkweb = this.configModule.account.wxworkweb;
      config.client = configWxworkweb.client;
      config.scope = configWxworkweb.scope;
      return config;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(code, state) {
      // code/memberId
      const res = await ctx.bean.wxwork.app.selfBuilt.getUserIdByCode(code);
      if (res.errcode) throw new Error(res.errmsg);
      const memberId = res.UserId;
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
