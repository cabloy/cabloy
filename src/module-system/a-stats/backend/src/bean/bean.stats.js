let __stats;
let __statsDeps;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'stats');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelStats() {
      return ctx.model.module(moduleInfo.relativeName).stats;
    }

    notify({ module, name, nameSub, user }) {
      module = module || this.moduleName;
      user = user || (ctx.state.user && ctx.state.user.op);
      ctx.tail(() => {
        this._notify_tail({ module, name, nameSub, user, async: false });
      });
    }

    async notifyAsync({ module, name, nameSub, user }) {
      module = module || this.moduleName;
      user = user || (ctx.state.user && ctx.state.user.op);
      await this._notify_tail({ module, name, nameSub, user, async: true });
    }

    _notify_tail({ module, name, nameSub, user, async }) {
      const provider = this._findStatsProvider({ module, name });
      if (provider.user && !user) return;
      // queue
      const method = async ? 'queuePushAsync' : 'queuePush';
      return ctx.meta.util[method]({
        module: moduleInfo.relativeName,
        queueName: 'stats',
        queueNameSub: provider.user ? 'user' : 'instance',
        data: {
          module,
          name,
          nameSub,
          user,
        },
      });
    }

    async _notify_queue({ module, name, nameSub, user }) {
      // loop names
      await this._notify_queue_names({ module, name, nameSub, user });
      // deps
      await this._notify_queue_deps({ module, name, nameSub, user });
    }

    async _notify_queue_names({ module, name, nameSub, user }) {
      const provider = this._findStatsProvider({ module, name });
      const fullName = this._getFullName({ name, nameSub });
      const names = fullName.split('.');
      for (let i = 0; i < names.length; i++) {
        const keys = names.slice(0, names.length - i);
        const fullNameSub = keys.join('.');
        // execute
        const value = await ctx.bean._getBean(provider.beanFullName).execute({
          keys,
          provider,
          user,
        });
        // set
        await this._set({
          module,
          name,
          fullName: fullNameSub,
          value,
          user: provider.user ? user : null,
        });
      }
    }

    async _notify_queue_deps({ module, name, nameSub, user }) {
      const fullKey = `${module}:${name}`;
      const deps = __statsDeps[fullKey];
      if (!deps || deps.length === 0) return;
      for (const dep of deps) {
        const [depModule, depName] = dep.split(':');
        const providerDep = this._findStatsProvider({ module: depModule, name: depName });
        await this._notify_queue({
          module: depModule,
          name: depName,
          nameSub: providerDep.inheritNameSub ? nameSub : undefined,
          user,
        });
      }
    }

    async get({ module, name, nameSub, user }) {
      module = module || this.moduleName;
      const provider = this._findStatsProvider({ module, name });
      const fullName = this._getFullName({ name, nameSub });
      return await this._get({
        module,
        fullName,
        user: provider.user ? user : null,
      });
    }

    _getFullName({ name, nameSub }) {
      return nameSub ? `${name}.${nameSub}` : name;
    }

    async _get({ module, fullName, user }) {
      const where = { module, name: fullName };
      if (user) {
        where.userId = user.id;
      }
      const item = await this.modelStats.get(where);
      return item ? JSON.parse(item.value) : undefined;
    }

    async _set({ module, name, fullName, value, user }) {
      const where = { module, name: fullName };
      if (user) {
        where.userId = user.id;
      }
      const item = await this.modelStats.get(where);
      if (item) {
        await this.modelStats.update({
          id: item.id,
          value: JSON.stringify(value),
        });
      } else {
        const data = { module, name: fullName, value: JSON.stringify(value) };
        if (user) {
          data.userId = user.id;
        }
        await this.modelStats.insert(data);
      }
      // push
      if (user) {
        const message = {
          userIdTo: user.id,
          content: {
            module,
            name,
            fullName,
            value,
          },
        };
        await ctx.bean.io.publish({
          path: `/a/stats/stats/${module}/${fullName}`,
          message,
          messageClass: {
            module: 'a-stats',
            messageClassName: 'stats',
          },
        });
      }
    }

    _findStatsProvider({ module, name }) {
      module = module || this.moduleName;
      const fullKey = `${module}:${name}`;
      if (!__stats) {
        __statsDeps = {};
        __stats = this._collectStats();
        this._collectStatsDependents();
      }
      const provider = __stats[fullKey];
      if (!provider) throw new Error(`stats provider not found: ${fullKey}`);
      return provider;
    }

    _collectStats() {
      const stats = {};
      for (const module of ctx.app.meta.modulesArray) {
        const providers = module.main.meta && module.main.meta.stats && module.main.meta.stats.providers;
        if (!providers) continue;
        for (const key in providers) {
          const provider = providers[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          // bean
          const beanName = provider.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.stats.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.stats.${beanName.name}`;
          }
          // dependencies
          const dependencies = this._parseDependencies(fullKey, module, provider.dependencies);
          // ok
          stats[fullKey] = {
            ...provider,
            key,
            fullKey,
            beanFullName,
            dependencies,
          };
        }
      }
      return stats;
    }

    _collectStatsDependents() {
      for (const module of ctx.app.meta.modulesArray) {
        const providers = module.main.meta && module.main.meta.stats && module.main.meta.stats.providers;
        if (!providers) continue;
        for (const key in providers) {
          const provider = providers[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          this._parseDependents(fullKey, module, provider.dependents);
        }
      }
    }

    _parseDependencies(fullKey, module, dependencies) {
      if (!dependencies) return null;
      if (!Array.isArray(dependencies)) {
        dependencies = dependencies.split(',');
      }
      dependencies = dependencies.map(item => {
        if (item.indexOf(':') > -1) return item;
        return `${module.info.relativeName}:${item}`;
      });
      for (const dep of dependencies) {
        if (!__statsDeps[dep]) __statsDeps[dep] = [];
        __statsDeps[dep].push(fullKey);
      }
      return dependencies;
    }

    _parseDependents(fullKey, module, dependents) {
      if (!dependents) return;
      if (!Array.isArray(dependents)) {
        dependents = dependents.split(',');
      }
      dependents = dependents.map(item => {
        if (item.indexOf(':') > -1) return item;
        return `${module.info.relativeName}:${item}`;
      });
      for (const dep of dependents) {
        // deps
        if (!__statsDeps[fullKey]) __statsDeps[fullKey] = [];
        if (__statsDeps[fullKey].indexOf(dep) === -1) {
          __statsDeps[fullKey].push(dep);
        }
        // stats
        if (!__stats[dep].dependencies) __stats[dep].dependencies = [];
        if (__stats[dep].dependencies.indexOf(fullKey) === -1) {
          __stats[dep].dependencies.push(fullKey);
        }
      }
    }
  }

  return Stats;
};
