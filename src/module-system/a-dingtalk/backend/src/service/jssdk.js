module.exports = app => {

  class JSSDK extends app.Service {

    async jsconfig({ url }) {
      // config
      const config = this.ctx.config.account.dingtalk;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // jsconfig
      const res = await this.ctx.meta.dingtalk.app.selfBuilt.client.getJSApiConfig(url);
      return {
        ...res,
        agentId: configAppSelfBuilt.agentid,
        type: configAppSelfBuilt.jssdk.type,
        jsApiList: configAppSelfBuilt.jssdk.jsApiList,
      };

    }

  }

  return JSSDK;
};
