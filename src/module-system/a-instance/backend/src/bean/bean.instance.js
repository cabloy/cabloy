const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Instance {

    async get({ subdomain }) {
      // cache
      const cacheMem = ctx.cache.mem.module(moduleInfo.relativeName);
      let instance = cacheMem.get('instance');
      if (!instance) {
        instance = await this.resetCache({ subdomain });
      }
      return instance;
    }

    async resetCache({ subdomain }) {
      // cache
      const cacheMem = ctx.cache.mem.module(moduleInfo.relativeName);
      const instance = await ctx.db.get('aInstance', { name: subdomain });
      if (!instance) throw new Error(`instance not found: ${subdomain}`);
      // config
      instance.config = JSON.parse(instance.config) || {};
      // cache configs
      const instanceConfigs = extend(true, {}, ctx.app.meta.configs, instance.config);
      cacheMem.set('instanceConfigs', instanceConfigs);
      // cache instance
      cacheMem.set('instance', instance);
      return instance;
    }

  }
  return Instance;
};
