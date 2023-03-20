let __cacheBases;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Summer extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'summer');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    getCache({ module, name }) {
      module = module || this.moduleName;
      const cacheBase = this._findCacheBase({ module, name });
      return ctx.bean._newBean(`${moduleInfo.relativeName}.local.cache`, {
        cacheBase,
      });
    }

    _findCacheBase({ module, name }) {
      module = module || this.moduleName;
      const fullKey = `${module}:${name}`;
      if (!__cacheBases) {
        __cacheBases = this._collectCacheBases();
      }
      const cacheBase = __cacheBases[fullKey];
      if (!cacheBase) throw new Error(`summer cache not found: ${fullKey}`);
      return cacheBase;
    }

    _collectCacheBases() {
      const cacheBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const caches = module.main.meta && module.main.meta.summer && module.main.meta.summer.caches;
        if (!caches) continue;
        for (const key in caches) {
          const cache = caches[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          // bean
          const beanName = cache.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.summer.cache.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.summer.cache.${beanName.name}`;
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
