module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
      const value = await provider.expression({ ctx, value: current });

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
      const meta = ctx.app.meta.modules[this.moduleName].main.meta;
      return meta.sequence.providers[name];
    }

  }

  return Sequence;
};
