const require3 = require('require3');
const extend = require3('extend2');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Instance {

    async list(where) {
      if (!where) where = { disabled: 0 }; // allow disabled=undefined
      return await ctx.db.select('aInstance', { where });
    }

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
      if (!instance) {
        // prompt
        if (ctx.app.meta.isLocal) {
          const urlInfo = ctx.locale === 'zh-cn' ? 'https://cabloy.com/zh-cn/articles/multi-instance.html' : 'https://cabloy.com/articles/multi-instance.html';
          let message = `Please add instance in ${chalk.keyword('cyan')('src/backend/config/config.local.js')}`;
          message += '\n' + chalk.keyword('orange')(`{ subdomain: '${ctx.subdomain}', password: '', title: '' }`);
          message += `\nMore info: ${chalk.keyword('cyan')(urlInfo)}`;
          console.log('\n' + boxen(message, boxenOptions));
        }
        return ctx.throw(423);
      }
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
      await this.instanceStartup();
    }

    async instanceStartup(options) {
      if (!options) options = { force: false, instance: null };
      // queue
      await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'instanceStartup',
        data: options,
      });
    }

    async _instanceStartupQueue(options) {
      return await ctx.app.meta._runStartupInstance({
        subdomain: ctx.subdomain,
        options,
      });
    }

  }
  return Instance;
};
