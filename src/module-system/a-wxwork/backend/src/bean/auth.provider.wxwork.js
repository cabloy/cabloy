const Strategy = require('../config/passport/strategy-wxwork.js');

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
      const configWxwork = this.configModule.account.wxwork;
      return {
        scenes: configWxwork.scenes,
        locales: configWxwork.locals,
      };
    }
    checkConfigValid(config) {
      return !!config.corpId && !!config.corpSecret && config.agentId;
    }
    async adjustConfigForCache(config) {
      // corpId/corpSecret/agentId
      if (this.providerScene !== 'selfBuilt') {
        const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
          module: this.providerModule,
          providerName: this.providerName,
          providerScene: 'selfBuilt',
        });
        const configSelfBuilt = beanProvider.configProviderScene;
        if (!config.corpId) config.corpId = configSelfBuilt.corpId;
        if (!config.corpSecret) config.corpSecret = configSelfBuilt.corpSecret;
        if (!config.agentId) config.agentId = configSelfBuilt.agentId;
      }
      if (config.corpId) config.corpid = config.corpId;
      if (config.corpSecret) config.corpsecret = config.corpSecret;
      if (config.agentId) config.agentid = config.agentId;
      if (config.appSecret) config.secret = config.appSecret;
      // message
      if (config.message) {
        const action = this.providerScene === 'selfBuilt' ? 'index' : this.providerScene;
        config.message.__messageURL = ctx.bean.base.getAbsoluteUrl(`/api/${moduleInfo.url}/message/${action}`);
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
