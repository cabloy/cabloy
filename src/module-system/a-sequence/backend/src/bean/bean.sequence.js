let __sequences;

module.exports = ctx => {
  const moduleInfo = module.info;
  class Sequence extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'sequence');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

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
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.sequence.${moduleName}.${name}`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
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

    _findSequenceProvider(name) {
      const fullKey = `${this.moduleName}:${name}`;
      if (!__sequences) {
        __sequences = this._collectSequences();
      }
      return __sequences[fullKey];
    }

    _collectSequences() {
      const sequences = {};
      for (const module of ctx.app.meta.modulesArray) {
        const providers = module.main.meta && module.main.meta.sequence && module.main.meta.sequence.providers;
        if (!providers) continue;
        for (const key in providers) {
          const provider = providers[key];
          const beanName = provider.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.sequence.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.sequence.${beanName.name}`;
          }
          const fullKey = `${module.info.relativeName}:${key}`;
          sequences[fullKey] = {
            ...provider,
            beanFullName,
          };
        }
      }
      return sequences;
    }
  }

  return Sequence;
};
