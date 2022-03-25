const require3 = require('require3');
const extend = require3('extend2');
const Strategy = require('../config/passport/strategy-dingtalk.js');

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
      const configDingtalkweb = this.configModule.account.dingtalkweb;
      return {
        scenes: configDingtalkweb.scenes,
      };
    }
    checkConfigValid(config) {
      return !!config.appKey && !!config.appSecret && !!config.agentId;
    }
    async adjustConfigForCache(config) {
      // from dingtalk
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: this.providerModule,
        providerName: 'dingtalk',
        providerScene: this.providerScene,
      });
      // config should be the last, as maybe disabled
      config = extend(true, {}, beanProvider.configProviderScene, config);
      // ok
      return config;
    }
    async adjustConfigForAuthenticate(config) {
      const configDingtalkweb = this.configModule.account.dingtalkweb;
      config.client = configDingtalkweb.client;
      config.scope = configDingtalkweb.scope;
      return config;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(authCode, state) {
      // config
      const config = this.configProviderScene;
      // code/memberId
      //   use dingtalk.app.selfBuilt
      const res = await ctx.bean.dingtalk.app[this.providerScene].oauth2.getUserToken(
        {
          clientId: config.appKey,
          clientSecret: config.appSecret,
          code: authCode,
          grantType: 'authorization_code',
          refreshToken: null,
        },
        { ignoreAccessToken: true }
      );
      let user = await ctx.bean.dingtalk.app[this.providerScene].contact.getUser('me', {
        xAcsDingtalkAccessToken: res.accessToken,
      });
      const unionId = user.unionId;
      user = await ctx.bean.dingtalk.app.selfBuilt.oapi.user.getUseridByUnionid(unionId);
      if (user.contactType === 1) throw new Error('not support extcontact');
      const memberId = user.userid;
      const verifyUser = await this.localHelper.verifyAuthUser({
        beanProvider: this,
        memberId,
        state,
        needLogin: false,
      });
      return verifyUser;
    }
  }

  return Provider;
};
