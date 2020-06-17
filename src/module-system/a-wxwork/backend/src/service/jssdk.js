module.exports = app => {

  class JSSDK extends app.Service {

    async jsconfig({ url }) {
      // config
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // params
      const params = {
        debug: configAppSelfBuilt.jssdk.debug,
        jsApiList: configAppSelfBuilt.jssdk.jsApiList,
        url,
      };
      return await this.ctx.meta.wxwork.app.selfBuilt.getJsConfig(params);
    }

    async jsconfigAgent({ url }) {
      // config
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // params
      const params = {
        agentid: configAppSelfBuilt.agentid,
        jsApiList: configAppSelfBuilt.jssdkAgent.jsApiList,
        url,
      };
      return await this.ctx.meta.wxwork.app.selfBuilt.getJsConfigAgent(params);
    }

  }

  return JSSDK;
};
