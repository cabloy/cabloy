const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;
const extend = require3('extend2');
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

    async getProvider({ module, sceneName }) {
      // default scene
      const configDefault = ctx.config.module(moduleInfo.relativeName);
      const sceneDefault = configDefault.captcha.scenes.default;
      // module scene
      const configModule = ctx.config.module(module);
      const sceneModule = (configModule.captcha && configModule.captcha.scenes && configModule.captcha.scenes[sceneName]) || null;
      return extend(true, {}, sceneDefault, sceneModule);
    }

    // create provider instance
    async createProviderInstance({ module, sceneName, context }) {
      // provider
      const provider = await this.getProvider({ module, sceneName });
      // instance id
      const providerInstanceId = uuid.v4().replace(/-/g, '');
      // cache
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      await ctx.cache.db.module(moduleInfo.relativeName).set(key, { providerInstanceId, module, sceneName, context }, provider.timeout);
      // ok
      return { providerInstanceId, provider };
    }

    // update
    async update({ providerInstanceId, data }) {
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await cache.get(key);
      if (!providerInstance) ctx.throw(403);
      // provider
      const provider = await this.getProvider({ module: providerInstance.module, sceneName: providerInstance.sceneName });
      // update
      providerInstance.data = data;
      await cache.set(key, providerInstance, provider.timeout);
    }

    async verify({ module, sceneName, providerInstanceId, dataInput }) {
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await cache.get(key);
      if (!providerInstance) ctx.throw(403);
      // check if the same scene
      if (module !== providerInstance.module || sceneName !== providerInstance.sceneName) ctx.throw(403);
      // provider
      const provider = await this.getProvider({ module: providerInstance.module, sceneName: providerInstance.sceneName });
      // invoke provider verify
      const _moduleInfo = mparse.parseInfo(provider.module);
      await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${provider.name}/verify`,
        body: {
          providerInstanceId,
          context: providerInstance.context,
          data: providerInstance.data,
          dataInput,
        },
      });
      // // clear
      // await cache.remove(key);
      // should hold the cache item
      // update
      providerInstance.data = null;
      await cache.set(key, providerInstance, provider.timeout);
    }

  }
  return Captcha;
};
