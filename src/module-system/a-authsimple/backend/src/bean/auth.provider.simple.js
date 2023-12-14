const Strategy = require('../meta/passport/strategy.js');

const moduleInfo = module.info;
module.exports = class Provider extends module.meta.class.AuthProviderBase {
  get localSimple() {
    return this.ctx.bean.local.module(moduleInfo.relativeName).simple;
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
    // const { auth, password, rememberMe } = body.data;
    // validate
    await this.ctx.bean.validation.validate({ module: moduleInfo.relativeName, validator: 'signin', data: body.data });
    // exists
    return await this.ctx.bean.authSimple.ensureAuthUser({ beanProvider: this, data: body.data });
  }
};
