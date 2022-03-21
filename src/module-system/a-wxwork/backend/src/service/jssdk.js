module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class JSSDK extends app.Service {
    async jsconfig({ url }) {
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wxwork',
        providerScene: 'selfBuilt',
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // config
      const config = beanProvider.configProviderScene;
      // params
      const params = {
        debug: config.jssdk.debug,
        jsApiList: config.jssdk.jsApiList,
        url,
      };
      return await this.ctx.bean.wxwork.app.selfBuilt.getJsConfig(params);
    }

    async jsconfigAgent({ url }) {
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wxwork',
        providerScene: 'selfBuilt',
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // config
      const config = beanProvider.configProviderScene;
      // params
      const params = {
        agentid: config.agentId,
        jsApiList: config.jssdkAgent.jsApiList,
        url,
      };
      return await this.ctx.bean.wxwork.app.selfBuilt.getJsConfigAgent(params);
    }
  }

  return JSSDK;
};
