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
      const configWxwork = this.configModule.account.wxwork;
      return {
        scenes: configWxwork.scenes,
      };
    }
    checkConfigValid(config) {
      return !!config.corpId && !!config.secret && !!config.agentId;
    }
    async adjustConfigForCache(config) {
      // corpId/agentId/secret
      if (this.providerScene !== 'selfBuilt') {
        const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
          module: this.providerModule,
          providerName: this.providerName,
          providerScene: 'selfBuilt',
        });
        const configSelfBuilt = beanProvider.configProviderScene;
        if (!config.corpId) config.corpId = configSelfBuilt.corpId;
        if (!config.agentId) config.agentId = configSelfBuilt.agentId;
      }
      // message
      if (config.message) {
        config.message.__messageURL = ctx.bean.base.getAbsoluteUrl(
          `/api/${moduleInfo.url}/message/${this.providerName}/${this.providerScene}`
        );
      }
      // ok
      return config;
    }
    async adjustConfigForAuthenticate(config) {
      const configWxwork = this.configModule.account.wxwork;
      config.client = configWxwork.client;
      config.scope = configWxwork.scope;
      return config;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(code, state) {
      // code/memberId
      const res = await ctx.bean.wxwork.app[this.providerScene].getUserIdByCode(code);
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
