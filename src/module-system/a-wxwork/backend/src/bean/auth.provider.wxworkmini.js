module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    async getConfigDefault() {
      const configWxworkmini = this.configModule.account.wxworkmini;
      return {
        scenes: configWxworkmini.scenes,
        locales: configWxworkmini.locales,
      };
    }
    checkConfigValid(config) {
      return !!config.appID && !!config.appSecret;
    }
    async adjustConfigForCache(config) {
      // corpId/corpSecret/agentId
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: this.providerModule,
        providerName: 'wxwork',
        providerScene: 'selfBuilt',
      });
      const configSelfBuilt = beanProvider.configProviderScene;
      if (!config.corpId) config.corpId = configSelfBuilt.corpId;
      if (!config.corpSecret) config.corpSecret = configSelfBuilt.corpSecret;
      if (!config.agentId) config.agentId = configSelfBuilt.agentId;
      if (config.corpId) config.corpid = config.corpId;
      if (config.corpSecret) config.corpsecret = config.corpSecret;
      if (config.agentId) config.agentid = config.agentId;
      if (config.appSecret) config.secret = config.appSecret;
      return config;
    }
    async adjustConfigForAuthenticate(config) {
      return config;
    }
  }

  return Provider;
};
