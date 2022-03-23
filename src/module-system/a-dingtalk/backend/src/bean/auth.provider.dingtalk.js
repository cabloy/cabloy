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
      const configDingtalk = this.configModule.account.dingtalk;
      return {
        scenes: configDingtalk.scenes,
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
      // message
      if (config.message) {
        config.message.__messageURL = ctx.bean.base.getAbsoluteUrl(
          `/api/${moduleInfo.url}/message/${this.providerScene}`
        );
      }
      // ok
      return config;
    }
    async adjustConfigForAuthenticate(config) {
      const configDingtalk = this.configModule.account.dingtalk;
      config.client = configDingtalk.client;
      return config;
    }
  }

  return Provider;
};
