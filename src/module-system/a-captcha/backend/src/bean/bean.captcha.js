const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;
const extend = require3('@zhennann/extend');
const uuid = require3('uuid');
const utils = require('../common/utils.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'captcha');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get cacheModule() {
      return ctx.cache.db.module(moduleInfo.relativeName);
    }

    async getProvider({ module, sceneName }) {
      // default scene
      const sceneDefault = this.configModule.captcha.scenes.default;
      // module scene
      const configModuleScene = ctx.config.module(module);
      const sceneModule = ctx.bean.util.getProperty(configModuleScene, `captcha.scenes.${sceneName}`) || null;
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
      await this.cacheModule.set(key, { providerInstanceId, module, sceneName, context }, provider.timeout);
      // ok
      return { providerInstanceId, provider };
    }

    // get
    async getProviderInstance({ providerInstanceId }) {
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      return await this.cacheModule.get(key);
    }

    // update
    async update({ providerInstanceId, data, context }) {
      // key
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await this.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // provider
      const provider = await this.getProvider({
        module: providerInstance.module,
        sceneName: providerInstance.sceneName,
      });
      // update
      providerInstance.data = data;
      providerInstance.context = context;
      await this.cacheModule.set(key, providerInstance, provider.timeout);
    }

    async verify({ module, sceneName, providerInstanceId, dataInput }) {
      // key
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await this.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // check if the same scene
      if (module !== providerInstance.module || sceneName !== providerInstance.sceneName) ctx.throw(403);
      // provider
      const provider = await this.getProvider({
        module: providerInstance.module,
        sceneName: providerInstance.sceneName,
      });
      // invoke provider verify
      const _moduleInfo = mparse.parseInfo(provider.module);
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName: `${_moduleInfo.relativeName}.captcha.provider.${provider.name}`,
        context: {
          providerInstanceId,
          context: providerInstance.context,
          data: providerInstance.data,
          dataInput,
        },
        fn: 'verify',
      });
      // // clear
      // await cache.remove(key);
      // should hold the cache item
      // update
      providerInstance.data = null;
      await this.cacheModule.set(key, providerInstance, provider.timeout);
    }
  }
  return Captcha;
};
