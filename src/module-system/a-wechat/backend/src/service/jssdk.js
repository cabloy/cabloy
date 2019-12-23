module.exports = app => {

  class JSSDK extends app.Service {

    async config({ url }) {
      // config
      const config = this.ctx.config.account.public;
      // params
      const params = {
        debug: app.meta.isLocal,
        jsApiList: config.jsApiList,
        url,
      };
      return await this.ctx.meta.wechat.getJsConfig(params);
    }

  }

  return JSSDK;
};
