/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 565:
/***/ ((module) => {

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


/***/ }),

/***/ 870:
/***/ ((module) => {

module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {}
  return IOMessage;
};


/***/ }),

/***/ 58:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const data = context.data;
      return await this.ctx.bean.stats._notify_queue(data);
    }
  }

  return Queue;
};


/***/ }),

/***/ 370:
/***/ ((module) => {

module.exports = ctx => {
  class Stats {
    async execute(context) {
      const { keys, provider, user } = context;
      const dependencies = provider.dependencies;
      let count = 0;
      for (const dep of dependencies) {
        const [module, name] = dep.split(':');
        const _keys = keys.slice(0);
        _keys.splice(0, 1, name);
        const fullName = _keys.join('.');
        const value = await ctx.bean.stats._get({
          module,
          fullName,
          user,
        });
        if (value) {
          count += value;
        }
      }
      return count;
    }
  }

  return Stats;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aStats
        const sql = `
          CREATE TABLE aStats (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const queueStats = __webpack_require__(58);
const beanStats = __webpack_require__(565);
const ioMessageStats = __webpack_require__(870);
const statsDeps = __webpack_require__(370);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.stats': {
      mode: 'app',
      bean: queueStats,
    },
    // io
    'io.message.stats': {
      mode: 'ctx',
      bean: ioMessageStats,
    },
    // global
    stats: {
      mode: 'ctx',
      bean: beanStats,
      global: true,
    },
    // stats
    'stats.deps': {
      mode: 'ctx',
      bean: statsDeps,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    stats: {
      bean: 'stats',
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 707:
/***/ ((module) => {

module.exports = app => {
  const stats = {
    info: {
      bean: 'stats',
      title: 'Stats',
      persistence: false,
    },
  };
  return stats;
};


/***/ }),

/***/ 473:
/***/ ((module) => {

module.exports = app => {
  class StatsController extends app.Controller {
    async get() {
      const { module, name, nameSub } = this.ctx.request.body;
      // only support user stats
      const provider = this.ctx.bean.stats._findStatsProvider({ module, name });
      if (!provider.user) this.ctx.throw(403);
      // get
      const res = await this.service.stats.get({
        module,
        name,
        nameSub,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return StatsController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const stats = __webpack_require__(473);

module.exports = app => {
  const controllers = {
    stats,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const services = __webpack_require__(214);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // meta
  const meta = __webpack_require__(458)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // models
  const models = __webpack_require__(230)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const socketioStats = __webpack_require__(707)(app);
  const meta = {
    socketio: {
      messages: {
        stats: socketioStats,
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 453:
/***/ ((module) => {

module.exports = app => {
  class Stats extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aStats', options: { disableDeleted: true } });
    }
  }
  return Stats;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const stats = __webpack_require__(453);

module.exports = app => {
  const models = {
    stats,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [{ method: 'post', path: 'stats/get', controller: 'stats' }];
  return routes;
};


/***/ }),

/***/ 854:
/***/ ((module) => {

module.exports = app => {
  class Stats extends app.Service {
    async get({ module, name, nameSub, user }) {
      return await this.ctx.bean.stats.get({ module, name, nameSub, user });
    }
  }

  return Stats;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const stats = __webpack_require__(854);
module.exports = {
  stats,
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map