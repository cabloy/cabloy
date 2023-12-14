const Strategy = require('../meta/passport/strategy.js');

const moduleInfo = module.info;
module.exports = class Provider extends module.meta.class.AuthProviderBase {
  // get localSimple() {
  //   return this.ctx.bean.local.module(moduleInfo.relativeName).simple;
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
    await this.ctx.bean.validation.validate({ module: moduleInfo.relativeName, validator: 'signin', data: body.data });
    // exists
    const user = await this.ctx.bean.user.exists({ mobile });
    if (!user) return this.ctx.throw.module(moduleInfo.relativeName, 1004);
    // disabled
    if (user.disabled) return this.ctx.throw.module(moduleInfo.relativeName, 1005);
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
};
