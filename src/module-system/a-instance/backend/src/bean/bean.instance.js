const async = require('async');
const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const __queueInstanceStartup = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Instance {
    get cacheMem() {
      return ctx.cache.mem.module(moduleInfo.relativeName);
    }

    async list(options) {
      // options
      if (!options) options = { where: null, orders: null, page: null };
      const page = ctx.bean.util.page(options.page, false);
      const orders = options.orders;
      const where = options.where || { disabled: 0 }; // allow disabled=undefined
      // select
      const _options = { where, orders };
      if (page.size !== 0) {
        _options.limit = page.size;
        _options.offset = page.index;
      }
      const modelInstance = ctx.model.module(moduleInfo.relativeName).instance;
      return await modelInstance.select(_options);
    }

    async get({ subdomain }) {
      // cache
      const instance = this.cacheMem.get('instance');
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
      // lock
      return await ctx.meta.util.lock({
        subdomain: null,
        resource: `${moduleInfo.relativeName}.registerInstance.${subdomain}`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            subdomain: null,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'instance',
            context: { instanceBase },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ instanceBase }) {
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

    async reload() {
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-instance',
        broadcastName: 'reload',
        data: null,
      });
    }

    async instanceChanged(reload = true) {
      if (reload) {
        // force to reload instance
        await this.reload();
      } else {
        // broadcast
        ctx.meta.util.broadcastEmit({
          module: 'a-instance',
          broadcastName: 'resetCache',
          data: null,
        });
      }
    }

    async resetCache({ subdomain }) {
      // cache
      const instance = await this._get({ subdomain });
      if (!instance) return null;
      // config
      instance.config = JSON.parse(instance.config) || {};
      // cache configs
      const instanceConfigs = ctx.bean.util.extend({}, ctx.app.meta.configs, instance.config);
      this.cacheMem.set('instanceConfigs', instanceConfigs);
      // cache configsFront
      const instanceConfigsFront = this._mergeInstanceConfigFront({ instanceConfigs });
      this.cacheMem.set('instanceConfigsFront', instanceConfigsFront);
      // cache instance
      this.cacheMem.set('instance', instance);
      return instance;
    }

    getInstanceConfigs() {
      return this.cacheMem.get('instanceConfigs');
    }

    getInstanceConfigsFront() {
      return this.cacheMem.get('instanceConfigsFront');
    }

    _mergeInstanceConfigFront({ instanceConfigs }) {
      const instanceConfigsFront = {};
      for (const moduleName in instanceConfigs) {
        const instanceConfig = instanceConfigs[moduleName];
        if (instanceConfig.configFront) {
          instanceConfigsFront[moduleName] = instanceConfig.configFront;
        }
      }
      return instanceConfigsFront;
    }

    async checkAppReady(options) {
      if (!options) options = { wait: true };
      if (!ctx.app.meta.appReady && options.wait === false) return false;
      while (!ctx.app.meta.appReady) {
        await ctx.bean.util.sleep(300);
      }
      return true;
    }

    async checkAppReadyInstance(options) {
      if (!options) options = { startup: true };
      // chech appReady first
      const appReady = await ctx.bean.instance.checkAppReady({ wait: options.startup !== false });
      if (!appReady) return false;
      // check appReady instance
      const subdomain = ctx.subdomain;
      if (subdomain === undefined) throw new Error(`subdomain not valid: ${subdomain}`);
      if (ctx.app.meta.appReadyInstances[subdomain]) return true;
      // instance startup
      if (options.startup === false) return false;
      await this.instanceStartup({ subdomain });
      return true;
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
          ctx.app.meta
            ._runStartupInstance({ subdomain: info.subdomain, options: info.options })
            .then(() => {
              info.resolve();
              cb();
            })
            .catch(err => {
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

    async initInstance() {
      // instance
      const instance = await ctx.bean.instance.get({ subdomain: ctx.subdomain });
      if (!instance) {
        // prompt: should for local/prod
        // if (ctx.app.meta.isLocal) {
        const urlInfo =
          ctx.locale === 'zh-cn'
            ? 'https://cabloy.com/zh-cn/articles/multi-instance.html'
            : 'https://cabloy.com/articles/multi-instance.html';
        let message = `Please add instance in ${chalk.keyword('cyan')('src/backend/config/config.[env].js')}`;
        message += '\n' + chalk.keyword('orange')(`{ subdomain: '${ctx.subdomain}', password: '', title: '' }`);
        message += `\nMore info: ${chalk.keyword('cyan')(urlInfo)}`;
        console.log('\n' + boxen(message, boxenOptions));
        // }
        return ctx.throw(423); // not ctx.fail(423)
      }
      // check if disabled
      if (instance.disabled) {
        // locked
        console.log('instance disabled: ', ctx.subdomain);
        return ctx.throw(423); // not ctx.fail(423)
      }

      // check instance startup ready
      await this.checkAppReadyInstance();

      // try to save host/protocol to config
      if (ctxHostValid(ctx)) {
        if (!instance.config['a-base']) instance.config['a-base'] = {};
        const aBase = instance.config['a-base'];
        if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
          aBase.host = ctx.host;
          aBase.protocol = ctx.protocol;
          // update
          const modelInstance = ctx.model.module(moduleInfo.relativeName).instance;
          await modelInstance.update({
            id: instance.id,
            config: JSON.stringify(instance.config),
          });
          // changed
          await this.instanceChanged(false);
        }
      }

      // ok
      ctx.instance = instance;
    }
  }
  return Instance;
};

function ctxHostValid(ctx) {
  // not check localhost, because almost inner api call use 127.0.0.1
  return (
    !ctx.innerAccess &&
    ctx.host &&
    ctx.protocol &&
    ctx.host.indexOf('127.0.0.1') === -1 &&
    // ctx.host.indexOf('localhost') === -1 &&
    ['http', 'https'].includes(ctx.protocol)
  );
}
