let __sequences;

const moduleInfo = module.info;
module.exports = class Sequence extends module.meta.class.BeanModuleBase {
  constructor(moduleName) {
    super(moduleName, 'sequence');
  }

  async reset(name) {
    const provider = this._findSequenceProvider(name);
    const sequence = await this._get(name);
    await this.ctx.db.update('aSequence', {
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
    return await this.ctx.meta.util.lock({
      resource: `${moduleInfo.relativeName}.sequence.${moduleName}.${name}`,
      fn: async () => {
        return await this.ctx.meta.util.executeBeanIsolate({
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
    const value = await this.ctx.bean._getBean(provider.beanFullName).execute({ value: current });

    // save
    if (sequence) {
      await this.ctx.db.update('aSequence', {
        id: sequence.id,
        value: JSON.stringify(value),
      });
    } else {
      // insert
      await this.ctx.db.insert('aSequence', {
        iid: this.ctx.instance.id,
        module: this.moduleName,
        name,
        value: JSON.stringify(value),
      });
    }

    return value;
  }

  async _get(name) {
    // get
    const sequence = await this.ctx.db.get('aSequence', {
      iid: this.ctx.instance.id,
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
    for (const module of this.ctx.app.meta.modulesArray) {
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
};
