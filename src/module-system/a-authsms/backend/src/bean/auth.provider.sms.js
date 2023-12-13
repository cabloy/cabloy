const Strategy = require('../meta/passport/strategy.js');

module.exports = function (ctx) {
  const moduleInfo = module.info;
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    // get localSimple() {
    //   return ctx.bean.local.module(moduleInfo.relativeName).simple;
    // }
    async getConfigDefault() {
      return null;
    }
    checkConfigValid(/* config*/) {
      return true;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(body) {
      const { mobile, rememberMe } = body.data;
      // validate
      await ctx.bean.validation.validate({ module: moduleInfo.relativeName, validator: 'signin', data: body.data });
      // exists
      const user = await ctx.bean.user.exists({ mobile });
      if (!user) return ctx.throw.module(moduleInfo.relativeName, 1004);
      // disabled
      if (user.disabled) return ctx.throw.module(moduleInfo.relativeName, 1005);
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: mobile,
        maxAge: rememberMe ? null : 0,
        authShouldExists: true,
        profile: {
          mobile,
          rememberMe,
        },
      };
    }
  }

  return Provider;
};
