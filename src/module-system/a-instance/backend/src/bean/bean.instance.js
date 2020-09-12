const require3 = require('require3');
const extend = require3('extend2');
const async = require3('async');

const __queueInstanceStartup = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Instance {

    // todo: could support paged
    // async list(where) {
    //   if (!where) where = { disabled: 0 }; // allow disabled=undefined
    //   return await ctx.db.select('aInstance', { where });
    // }

    async get({ subdomain }) {
      // cache
      const cacheMem = ctx.cache.mem.module(moduleInfo.relativeName);
      const instance = cacheMem.get('instance');
      if (instance) return instance;
      return await this.resetCache({ subdomain });
    }

    async _get({ subdomain }) {
      // get
      const modelInstance = ctx.model.module(moduleInfo.relativeName).instance;
      const instance = await modelInstance.get({ name: subdomain });
      if (instance) return instance;
      // instance base
      const instanceBase = this._getInstanceBase({ subdomain });
      if (!instanceBase) return null;
      // queue
      return await ctx.app.meta.queue.pushAsync({
        module: moduleInfo.relativeName,
        queueName: 'registerInstance',
        queueNameSub: subdomain,
        data: instanceBase,
      });
    }

    async _registerQueue(instanceBase) {
      // get again
      const modelInstance = ctx.model.module(moduleInfo.relativeName).instance;
      let instance = await modelInstance.get({ name: instanceBase.subdomain });
      if (instance) return instance;
      // insert
      instance = {
        name: instanceBase.subdomain,
        title: instanceBase.title,
        config: JSON.stringify(instanceBase.config || {}),
        disabled: 0,
      };
      const res = await modelInstance.insert(instance);
      instance.id = res.insertId;
      return instance;
    }

    _getInstanceBase({ subdomain }) {
      const instances = ctx.app.config.instances || [{ subdomain: '', password: '' }];
      return instances.find(item => item.subdomain === subdomain);
    }

    async resetCache({ subdomain }) {
      // cache
      const cacheMem = ctx.cache.mem.module(moduleInfo.relativeName);
      const instance = await this._get({ subdomain });
      if (!instance) return null;
      // config
      instance.config = JSON.parse(instance.config) || {};
      // cache configs
      const instanceConfigs = extend(true, {}, ctx.app.meta.configs, instance.config);
      cacheMem.set('instanceConfigs', instanceConfigs);
      // cache instance
      cacheMem.set('instance', instance);
      return instance;
    }

    async checkAppReady() {
      while (!ctx.app.meta.appReady) {
        await ctx.bean.util.sleep(300);
      }
    }

    async checkAppReadyInstance() {
      // chech appReady first
      await ctx.bean.instance.checkAppReady();
      // check appReady instance
      const subdomain = ctx.subdomain;
      if (subdomain === undefined) throw new Error(`subdomain not valid: ${subdomain}`);
      if (ctx.app.meta.appReadyInstances[subdomain]) return;
      // instance startup
      await this.instanceStartup({ subdomain });
    }

    // options: force/instanceBase
    async instanceStartup({ subdomain, options }) {
      // queue within the same worker
      if (!__queueInstanceStartup[subdomain]) {
        __queueInstanceStartup[subdomain] = async.queue((info, cb) => {
          // check again
          const force = info.options && info.options.force;
          if (ctx.app.meta.appReadyInstances[info.subdomain] && !force) {
            info.resolve();
            cb();
            return;
          }
          // startup
          ctx.app.meta._runStartupInstance({ subdomain: info.subdomain, options: info.options }).then(() => {
            info.resolve();
            cb();
          }).catch(err => {
            info.reject(err);
            cb();
          });
        });
      }
      // promise
      return new Promise((resolve, reject) => {
        // options
        if (!options) options = { force: false, instanceBase: null };
        // queue push
        __queueInstanceStartup[subdomain].push({ resolve, reject, subdomain, options });
      });
    }

  }
  return Instance;
};
