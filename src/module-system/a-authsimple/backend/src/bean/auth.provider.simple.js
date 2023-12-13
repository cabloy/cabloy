const Strategy = require('../meta/passport/strategy.js');

module.exports = function (ctx) {
  const moduleInfo = module.info;
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get localSimple() {
      return ctx.bean.local.module(moduleInfo.relativeName).simple;
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
      await ctx.bean.validation.validate({ module: moduleInfo.relativeName, validator: 'signin', data: body.data });
      // exists
      return await ctx.bean.authSimple.ensureAuthUser({ beanProvider: this, data: body.data });
    }
  }

  return Provider;
};
