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
      return !!config.corpId && !!config.secret && !!config.agentId && !!config.appID && !!config.appSecret;
    }
    async adjustConfigForCache(config) {
      // corpId/agentId/secret
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: this.providerModule,
        providerName: 'wxwork',
        providerScene: 'selfBuilt',
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
