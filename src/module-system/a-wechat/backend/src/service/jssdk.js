module.exports = app => {

  class JSSDK extends app.Service {

    async jsconfig({ url }) {
      // config
      const config = this.ctx.config.account.public;
      // params
      const params = {
        debug: config.jssdk.debug,
        jsApiList: config.jssdk.jsApiList,
        url,
      };
      return await this.ctx.meta.wechat.app.getJsConfig(params);
    }

  }

  return JSSDK;
};
