const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Sequence {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's sequence
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
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
      const res = await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'sequence',
        data: {
          module: this.moduleName,
          name,
        },
      });
      return res;
    }

    async _next(name) {
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
      }
      // insert
      else {
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
