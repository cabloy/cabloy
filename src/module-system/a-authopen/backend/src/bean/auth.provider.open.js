const Strategy = require('../config/passport/strategy.js');

module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
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
      const { clientID, clientSecret } = body.data;
      // verify
      const authOpen = await ctx.bean.authOpen.verify({ clientID, clientSecret });
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: authOpen.id,
        maxAge: 0,
        authShouldExists: true,
        profile: {
          authOpenId: authOpen.id,
        },
      };
    }
  }

  return Provider;
};
