let __stats;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'stats');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // async
    async notify({ module, name, nameSub }) {
      module = module || this.moduleName;
      ctx.tail(() => {
        this._notify_tail({ module, name, nameSub });
      });
    }

    _notify_tail({ module, name, nameSub }) {
      const provider = this._findStatsProvider({ module, name });
      // queue
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'stats',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          module, name, nameSub,
        },
      });
    }


    // ////////////////////

    async reset(name) {
      const provider = this._findSequenceProvider(name);
      const sequence = await this._get(name);
      await ctx.db.update('aSequence', {
        id: sequence.id,
        value: JSON.stringify(provider.start),
      });
    }

    async current(name) {
      const sequence = await this._get(name);
      if (sequence) return JSON.parse(sequence.value);
      const provider = this._findSequenceProvider(name);
      return provider.start;
    }

    async next(name) {
      const moduleName = this.moduleName;
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.sequence.${moduleName}.${name}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'sequence',
            fn: async ({ bean }) => {
              return await bean.module(moduleName)._nextLock(name);
            },
          });
        },
      });
    }

    async _nextLock(name) {
      const provider = this._findSequenceProvider(name);
      const sequence = await this._get(name);

      // current
      let current;
      if (sequence) {
        current = JSON.parse(sequence.value);
      } else {
        current = provider.start;
      }

      // next
      const value = await ctx.bean._getBean(provider.beanFullName).execute({ value: current });

      // save
      if (sequence) {
        await ctx.db.update('aSequence', {
          id: sequence.id,
          value: JSON.stringify(value),
        });
      } else {
        // insert
        await ctx.db.insert('aSequence', {
          iid: ctx.instance.id,
          module: this.moduleName,
          name,
          value: JSON.stringify(value),
        });
      }

      return value;
    }

    async _get(name) {
      // get
      const sequence = await ctx.db.get('aSequence', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      return sequence;
    }

    _findStatsProvider({ module, name }) {
      module = module || this.moduleName;
      const fullKey = `${module}:${name}`;
      if (!__stats) {
        __stats = this._collectStats();
      }
      console.log(__stats);
      return __stats[fullKey];
    }

    _collectStats() {
      const stats = {};
      for (const module of ctx.app.meta.modulesArray) {
        const providers = module.main.meta && module.main.meta.stats && module.main.meta.stats.providers;
        if (!providers) continue;
        for (const key in providers) {
          const provider = providers[key];
          // bean
          const beanName = provider.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.stats.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.stats.${beanName.name}`;
          }
          // dependencies
          const dependencies = this._adjustDependencies(module, provider.dependencies);
          // ok
          const fullKey = `${module.info.relativeName}:${key}`;
          stats[fullKey] = {
            ...provider,
            beanFullName,
            dependencies,
          };
        }
      }
      return stats;
    }

    _adjustDependencies(module, dependencies) {
      if (!dependencies) return null;
      if (!Array.isArray(dependencies)) {
        dependencies = dependencies.split(',');
      }
      return dependencies.map(item => {
        if (item.indexOf(':') > -1) return item;
        return `${module.info.relativeName}:${item}`;
      });
    }

  }

  return Stats;
};
