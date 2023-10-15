let __cacheBases;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Summer extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'summer');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    getCache({ module, name, fullKey }) {
      fullKey = this._prepareFullKey({ module, name, fullKey });
      const cacheBase = this._findCacheBase({ fullKey });
      if (!cacheBase) throw new Error(`summer cache not found: ${fullKey}`);
      return ctx.bean._newBean(`${moduleInfo.relativeName}.local.cache`, {
        cacheBase,
      });
    }

    async get(cacheName, key, options) {
      const cache = this.getCache(cacheName);
      return await cache.get(key, options);
    }

    async mget(cacheName, keys, options) {
      const cache = this.getCache(cacheName);
      return await cache.mget(keys, options);
    }

    async del(cacheName, key, options) {
      const cache = this.getCache(cacheName);
      return await cache.del(key, options);
    }

    async mdel(cacheName, keys, options) {
      const cache = this.getCache(cacheName);
      return await cache.mdel(keys, options);
    }

    async clear(cacheName, options) {
      const cache = this.getCache(cacheName);
      return await cache.clear(options);
    }

    async peek(cacheName, key, options) {
      const cache = this.getCache(cacheName);
      return await cache.peek(key, options);
    }

    _findCacheBase({ module, name, fullKey }) {
      fullKey = this._prepareFullKey({ module, name, fullKey });
      if (!__cacheBases) {
        __cacheBases = this._collectCacheBases();
      }
      return __cacheBases[fullKey];
    }

    _prepareFullKey({ module, name, fullKey }) {
      if (!fullKey) {
        module = module || this.moduleName;
        fullKey = `${module}:${name}`;
      }
      return fullKey;
    }

    _collectCacheBases() {
      const cacheBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const config = ctx.app.meta.configs[module.info.relativeName];
        const caches = ctx.bean.util.getProperty(config, 'summer.caches');
        if (!caches) continue;
        for (const key in caches) {
          const cache = caches[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          // bean
          let beanFullName;
          const beanName = cache.bean;
          if (beanName) {
            if (typeof beanName === 'string') {
              beanFullName = `${module.info.relativeName}.summer.cache.${beanName}`;
            } else {
              beanFullName = `${beanName.module || module.info.relativeName}.summer.cache.${beanName.name}`;
            }
          }
          // ok
          cacheBases[fullKey] = {
            ...cache,
            key,
            fullKey,
            beanFullName,
          };
        }
      }
      return cacheBases;
    }
  }

  return Summer;
};
