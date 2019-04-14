const utils = require('../../../common/utils.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CaptchaContainer {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's mail
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // save
    async save({ provider, code }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName);
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      // timeout
      const timeout = config.cache.timeout;
      // user
      const user = ctx.user.agent;
      // get
      const key = utils.getCacheKey({ user });
      const value = await cache.get(key);
      console.log(value);
      if (!value) ctx.throw(403);
      // verify provider
      if (provider.module !== value.provider.module || provider.name !== value.provider.name) ctx.throw(403);
      // save
      value.code = code;
      await cache.set(key, value, timeout);
    }

  }
  return CaptchaContainer;
};
