module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class JSSDK extends app.Service {
    async jsconfig({ url }) {
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'dingtalk',
        providerScene: 'selfBuilt',
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // config
      const config = beanProvider.configProviderScene;
      // jsconfig
      const res = await this.ctx.bean.dingtalk.app.selfBuilt.client.getJSApiConfig(url);
      return {
        ...res,
        agentId: config.agentId,
        type: config.jssdk.type,
        jsApiList: config.jssdk.jsApiList,
      };
    }
  }

  return JSSDK;
};
