const require3 = require('require3');
const uuid = require3('uuid');
const utils = require('../../../common/utils.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's captcha
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // create provider instance
    async createProviderInstance({ module, sceneName, context }) {
      // config
      const config = this.ctx.config.module(moduleInfo.relativeName);
      // provider
      const provider = config.scenes.modules[module][sceneName];
      // timeout
      const timeout = provider.timeout || config.cache.timeout;
      // instance
      const providerInstanceId = uuid.v4().replace(/-/g, '');
      // cache
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      await ctx.cache.db.module(moduleInfo.relativeName).set(key, { providerInstanceId, module, sceneName, context }, timeout);
      // ok
      return { provider, providerInstanceId };
    }

    // save
    async save({ provider, code }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName);
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      // timeout
      const timeout = config.cache.timeout;
      // get
      const key = utils.getCacheKey({ ctx });
      const value = await cache.get(key);
      if (!value) ctx.throw(403);
      // verify provider
      if (provider.module !== value.provider.module || provider.name !== value.provider.name) ctx.throw(403);
      // save
      value.code = code;
      await cache.set(key, value, timeout);
    }

  }
  return Captcha;
};
