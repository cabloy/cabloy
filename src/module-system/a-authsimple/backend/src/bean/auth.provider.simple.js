const Strategy = require('../config/passport/strategy.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
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
      const { auth, password, rememberMe } = body.data;
      // validate
      await ctx.bean.validation.validate({ validator: 'signin', data: body.data });
      // exists
      const user = await ctx.bean.user.exists({ userName: auth, email: auth, mobile: auth });
      if (!user) return ctx.throw(1001);
      // disabled
      if (user.disabled) return ctx.throw(1002);
      // verify
      const authSimple = await ctx.bean.local.simple.verify({ userId: user.id, password });
      if (!authSimple) return ctx.throw(1001);
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: authSimple.id,
        maxAge: rememberMe ? null : 0,
        authShouldExists: true,
        profile: {
          authSimpleId: authSimple.id,
          rememberMe,
        },
      };
    }
  }

  return Provider;
};
