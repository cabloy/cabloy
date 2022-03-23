module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    async getConfigDefault() {
      const configDingtalkmini = this.configModule.account.dingtalkmini;
      return {
        scenes: configDingtalkmini.scenes,
      };
    }
    checkConfigValid(config) {
      return !!config.appKey && !!config.appSecret && !!config.agentId;
    }
    async adjustConfigForCache(config) {
      // corpId
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: this.providerModule,
        providerName: 'dingtalkadmin',
        providerScene: null,
      });
      const configSelfBuilt = beanProvider.configProviderScene;
      if (!config.corpId) config.corpId = configSelfBuilt.corpId;
      return config;
    }
    async adjustConfigForAuthenticate(config) {
      return config;
    }
  }

  return Provider;
};
