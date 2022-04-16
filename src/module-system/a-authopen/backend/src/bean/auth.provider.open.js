const Strategy = require('../config/passport/strategy.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get modelAuthOpen() {
      return ctx.model.module(moduleInfo.relativeName).authOpen;
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
      const { clientID, clientSecret } = body;
      // verify
      const authOpen = await this.modelAuthOpen.get({ clientID, clientSecret });
      if (!authOpen) return ctx.throw(403);
      // neverExpire/expireTime
      if (!authOpen.neverExpire && authOpen.expireTime <= Date.now()) {
        return ctx.throw.module(moduleInfo.relativeName, 1001);
      }
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
