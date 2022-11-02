/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 850:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cache {
    get db() {
      const config = ctx.config.module(moduleInfo.relativeName);
      if (config.db.redis) {
        return this.redis;
      }
      return this._db;
    }

    get _db() {
      return ctx.bean._getBean(moduleInfo, 'local.db');
    }

    get mem() {
      return ctx.bean._getBean(moduleInfo, 'local.mem');
    }

    get redis() {
      return ctx.bean._getBean(moduleInfo, 'local.redis');
    }
  }

  return Cache;
};


/***/ }),

/***/ 258:
/***/ ((module) => {

module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(data.moduleName);
        moduleCache._clear();
      }
    }
  }

  return Broadcast;
};


/***/ }),

/***/ 261:
/***/ ((module) => {

module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(data.moduleName);
        moduleCache._remove(data.name);
      }
    }
  }

  return Broadcast;
};


/***/ }),

/***/ 420:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheDb extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, `${moduleInfo.relativeName}.local.db`);
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async get(name) {
      const res = await this._has(name);
      return res ? JSON.parse(res.value) : undefined;
    }

    async set(name, value, timeout) {
      await this._set({ name, value, timeout, queue: true });
    }

    async getset(name, value, timeout) {
      const res = await this._set({ name, value, timeout, queue: true });
      return res ? JSON.parse(res.value) : undefined;
    }

    async _set({ name, value, timeout, queue }) {
      // second
      const second = timeout ? parseInt(timeout / 1000) : timeout;
      // expired
      const expired = second ? `TIMESTAMPADD(SECOND,${second},CURRENT_TIMESTAMP)` : 'null';
      const res = await ctx.db.get('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
        name,
      });
      if (res) {
        await ctx.db.query(
          `
          update aCache set value=?, expired=${expired}
            where id=?
          `,
          [JSON.stringify(value), res.id]
        );
      } else {
        if (queue) {
          await ctx.meta.util.lock({
            resource: `${moduleInfo.relativeName}.cacheDbSet.${this.moduleName}.${name}`,
            fn: async () => {
              return await ctx.meta.util.executeBeanIsolate({
                beanModule: moduleInfo.relativeName,
                fn: async ({ ctx }) => {
                  return await ctx.cache._db.module(this.moduleName)._set({ name, value, timeout, queue: false });
                },
              });
            },
          });
        } else {
          await ctx.db.query(
            `
            insert into aCache(iid,module,name,value,expired) values(?,?,?,?,${expired})
            `,
            [ctx.instance ? ctx.instance.id : 0, this.moduleName, name, JSON.stringify(value)]
          );
        }
      }
      // return old value
      if (!res) return null;
      if (!res.expired || res.expired.getTime() > new Date().getTime()) return res;
      return null;
    }

    async has(name) {
      const res = await this._has(name);
      return !!res;
    }

    async _has(name) {
      const sql =
        'select * from aCache where iid=? and module=? and name=? and (expired is null or expired>CURRENT_TIMESTAMP)';
      const res = await ctx.db.queryOne(sql, [ctx.instance ? ctx.instance.id : 0, this.moduleName, name]);
      return res;
    }

    async remove(name) {
      await ctx.db.delete('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
        name,
      });
    }

    async clear() {
      await ctx.db.delete('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
      });
    }
  }

  return CacheDb;
};


/***/ }),

/***/ 583:
/***/ ((module) => {

const CACHEMEMORY = Symbol('APP#__CACHEMEMORY');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheMem extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, `${moduleInfo.relativeName}.local.mem`);
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get memory() {
      if (!ctx.app[CACHEMEMORY]) {
        ctx.app[CACHEMEMORY] = {};
      }
      return ctx.bean.util.getPropertyObject(ctx.app[CACHEMEMORY], `${ctx.subdomain}&&${this.moduleName}`, '&&');
    }

    get(name) {
      const res = this.has(name);
      return res ? res.value : undefined;
    }

    set(name, value, timeout) {
      this.memory[name] = {
        value,
        timeout: timeout || 0,
        timestamp: new Date(),
      };
    }

    getset(name, value, timeout) {
      const valueOld = this.get(name);
      this.memory[name] = {
        value,
        timeout: timeout || 0,
        timestamp: new Date(),
      };
      return valueOld;
    }

    has(name) {
      const res = this.memory[name];
      if (!res) return null;
      return res.timeout === 0 || new Date() - res.timestamp < res.timeout ? res : null;
    }

    remove(name) {
      // remove this
      this._remove(name);
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-cache',
        broadcastName: 'memRemove',
        data: { moduleName: this.moduleName, name },
      });
    }

    // by broadcast
    _remove(name) {
      delete this.memory[name];
    }

    clear() {
      // clear this
      this._clear();
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-cache',
        broadcastName: 'memClear',
        data: { moduleName: this.moduleName },
      });
    }

    // by broadcast
    _clear() {
      if (
        ctx.app[CACHEMEMORY] &&
        ctx.app[CACHEMEMORY][ctx.subdomain] &&
        ctx.app[CACHEMEMORY][ctx.subdomain][this.moduleName]
      ) {
        ctx.app[CACHEMEMORY][ctx.subdomain][this.moduleName] = {};
      }
    }

    _clearAll() {
      if (ctx.app[CACHEMEMORY] && ctx.app[CACHEMEMORY][ctx.subdomain]) {
        const aInstance = ctx.app[CACHEMEMORY][ctx.subdomain]['a-instance'];
        ctx.app[CACHEMEMORY][ctx.subdomain] = { 'a-instance': aInstance };
      }
    }
  }

  return CacheMem;
};


/***/ }),

/***/ 310:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class RedisDb extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, `${moduleInfo.relativeName}.local.redis`);
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    _getKey(name) {
      return `${ctx.instance ? ctx.instance.id : 0}:${this.moduleName}:${name}`;
    }

    async get(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      const value = await redis.get(key);
      return value ? JSON.parse(value) : undefined;
    }

    async set(name, value, timeout) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      if (timeout) {
        await redis.set(key, JSON.stringify(value), 'PX', timeout);
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    }

    async getset(name, value, timeout) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      let valuePrev;
      if (timeout) {
        const res = await redis.multi().get(key).set(key, JSON.stringify(value), 'PX', timeout).exec();
        valuePrev = res[0][1];
      } else {
        const res = await redis.multi().get(key).set(key, JSON.stringify(value)).exec();
        valuePrev = res[0][1];
      }
      return valuePrev ? JSON.parse(valuePrev) : undefined;
    }

    async has(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      return (await redis.exists(key)) > 0;
    }

    async remove(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      await redis.del(key);
    }
  }

  return RedisDb;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aCache
        const sql = `
          CREATE TABLE aCache (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            timeout int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.db.query(sql);
      }

      if (options.version === 2) {
        let sql;
        // delete
        sql = `
          delete from aCache
        `;
        await this.ctx.db.query(sql);
        // alter table: aCache
        sql = `
          ALTER TABLE aCache
            DROP COLUMN timeout,
            ADD COLUMN expired timestamp DEFAULT NULL
        `;
        await this.ctx.db.query(sql);
      }
    }

    async init(options) {
      if (options.version === 0) {
        // cache reset
        //   : just clear mem cache
        await this.ctx.cache.mem._clearAll();
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const localDb = __webpack_require__(420);
const localMem = __webpack_require__(583);
const localRedis = __webpack_require__(310);
const broadcastMemClear = __webpack_require__(258);
const broadcastMemRemove = __webpack_require__(261);
const beanCache = __webpack_require__(850);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.db': {
      mode: 'ctx',
      bean: localDb,
    },
    'local.mem': {
      mode: 'ctx',
      bean: localMem,
    },
    'local.redis': {
      mode: 'ctx',
      bean: localRedis,
    },
    // broadcast
    'broadcast.memClear': {
      mode: 'app',
      bean: broadcastMemClear,
    },
    // broadcast
    'broadcast.memRemove': {
      mode: 'app',
      bean: broadcastMemRemove,
    },
    // global
    cache: {
      mode: 'ctx',
      bean: beanCache,
      global: true,
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

  // broadcasts
  config.broadcasts = {
    memRemove: {
      bean: 'memRemove',
    },
    memClear: {
      bean: 'memClear',
    },
  };

  // db
  config.db = {
    redis: true,
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

/***/ 792:
/***/ ((module) => {

module.exports = app => {
  class DbController extends app.Controller {}

  return DbController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const db = __webpack_require__(792);

module.exports = app => {
  const controllers = {
    db,
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
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    config,
    locales,
    errors,
  };
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [];
  return routes;
};


/***/ }),

/***/ 219:
/***/ ((module) => {

module.exports = app => {
  class Db extends app.Service {}

  return Db;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const db = __webpack_require__(219);

module.exports = {
  db,
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