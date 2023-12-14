const Strategy = require('../meta/passport/strategy.js');

// const moduleInfo = module.info;
module.exports = class Provider extends module.meta.class.AuthProviderBase {
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
    const authOpen = await this.ctx.bean.authOpen.verify({ clientID, clientSecret });
    // maxAge
    let maxAge;
    if (authOpen.neverExpire) {
      // only one day
      maxAge = 0;
    } else {
      maxAge = authOpen.expireTime - Date.now();
    }
    return {
      module: this.providerModule,
      provider: this.providerName,
      providerScene: this.providerScene,
      profileId: authOpen.id,
      maxAge,
      authShouldExists: true,
      profile: {
        authOpenId: authOpen.id,
      },
    };
  }
};
