module.exports = app => {

  class JSSDK extends app.Service {

    async jsconfig({ url }) {
      // config
      const config = this.ctx.config.account.dingtalk;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // params
      const params = {
        jsApiList: configAppSelfBuilt.jssdk.jsApiList,
      };
      // jsconfig
      return await this.ctx.meta.dingtalk.app.selfBuilt.client.getJSApiConfig(url, params);
    }

  }

  return JSSDK;
};
