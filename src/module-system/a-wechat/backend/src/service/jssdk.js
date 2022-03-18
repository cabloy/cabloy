module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class JSSDK extends app.Service {
    async jsconfig({ url }) {
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wechat',
        providerScene: null,
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
      return await this.ctx.bean.wechat.app.getJsConfig(params);
    }
  }

  return JSSDK;
};
