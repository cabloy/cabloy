module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const routes = __webpack_require__(2);
const services = __webpack_require__(6);
const config = __webpack_require__(9);
const locales = __webpack_require__(10);
const errors = __webpack_require__(12);
const middlewares = __webpack_require__(13);

// eslint-disable-next-line
module.exports = app => {

  // models
  const models = __webpack_require__(15)(app);
  // meta
  const meta = __webpack_require__(16)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    middlewares,
    models,
    meta,
  };

};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(3);
const instance = __webpack_require__(4);
const test = __webpack_require__(5);

module.exports = [
  // version
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'get', path: 'test/instance', controller: test, middlewares: 'test' },
  // instance
  { method: 'post', path: 'instance/item', controller: instance, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
  { method: 'post', path: 'instance/save', controller: instance, middlewares: 'validate',
    meta: {
      validate: { validator: 'instance' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    },
  },
  { method: 'post', path: 'instance/getConfigsPreview', controller: instance, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
];


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

    async init() {
      await this.service.version.init(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {
  class InstanceController extends app.Controller {

    async item() {
      const res = await this.service.instance.item();
      this.ctx.success(res);
    }

    async save() {
      await this.service.instance.save({
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async getConfigsPreview() {
      const res = await this.service.instance.getConfigsPreview();
      this.ctx.success(res);
    }

  }
  return InstanceController;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async instance() {
      assert(this.ctx.instance.id === 1);
      this.ctx.success();
    }

  }
  return TestController;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(7);
const instance = __webpack_require__(8);

module.exports = {
  version,
  instance,
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aInstance
        const sql = `
          CREATE TABLE aInstance (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.db.query(sql);
      }
      if (options.version === 2) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          ADD COLUMN title varchar(255) DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
      if (options.version === 3) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          ADD COLUMN meta json DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
      if (options.version === 4) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          CHANGE COLUMN meta config json DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        await this.ctx.db.insert('aInstance', { name: options.subdomain, disabled: 0 });
      }
      if (options.version === 2) {
        if (options.title) {
          const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
          await this.ctx.db.update('aInstance', { id: instance.id, title: options.title });
        }
      }
      // if (options.version === 3) {
      //   if (options.meta) {
      //     const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
      //     await this.ctx.db.update('aInstance', { id: instance.id, meta: JSON.stringify(options.meta) });
      //   }
      // }
      if (options.version === 4) {
        const config = options.config || {};
        const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
        await this.ctx.db.update('aInstance', { id: instance.id, config: JSON.stringify(config) });
      }
    }

  }

  return Version;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class Instance extends app.Service {

    async item() {
      return await this.ctx.db.get('aInstance', { id: this.ctx.instance.id });
    }

    async save({ data }) {
      await this.ctx.db.update('aInstance', {
        id: this.ctx.instance.id,
        title: data.title,
        config: data.config,
      });
    }

    async getConfigsPreview() {
      const instance = await this.item();
      instance.config = JSON.parse(instance.config);
      if (!this.ctx.app.meta._configsOriginal) this.ctx.app.meta._configsOriginal = extend(true, {}, this.ctx.app.meta.configs);
      this.ctx.app.meta.configs = extend(true, {}, this.ctx.app.meta._configsOriginal, instance.config);
      return { data: this.ctx.app.meta.configs };
    }

  }

  return Instance;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      global: true,
      dependencies: 'cachemem',
      ignore: /(\/version\/(start|check|update|initModule)|\/a\/instance\/version\/init|\/a\/version\/version\/init)/,
    },
  };

  // cache
  config.cache = {
    timeout: 3 * 1000, // 3s
  };

  return config;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(11),
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {
  Instance: '实例',
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const instance = __webpack_require__(14);

module.exports = {
  instance,
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = () => {
  return async function instance(ctx, next) {

    const timeout = ctx.config.module('a-instance').cache.timeout;
    let instance = timeout > 0 ? ctx.cache.mem.get('instance') : null;
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance) {
        // config
        instance.config = JSON.parse(instance.config) || {};
        // ctx.host ctx.protocol
        if (ctxHostValid(ctx)) {
          if (!instance.config['a-base']) instance.config['a-base'] = {};
          const aBase = instance.config['a-base'];
          if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
            aBase.host = ctx.host;
            aBase.protocol = ctx.protocol;
            await ctx.db.update('aInstance', {
              id: instance.id,
              config: JSON.stringify(instance.config) });
          }
        }
        // cache configs
        const instanceConfigs = extend(true, {}, ctx.app.meta.configs, instance.config);
        ctx.cache.mem.set('instanceConfigs', instanceConfigs);
        // cache
        //   if !host && !protocol then try to get them on next call
        if (ctxHostValid(ctx) && timeout > 0) {
          ctx.cache.mem.set('instance', instance, timeout);
        }
      }
    }

    if (!/\/version\/init/.test(ctx.request.url) && (!instance || instance.disabled)) {
      ctx.throw(423); // locked
    }

    ctx.instance = instance;

    // next
    await next();
  };
};

function ctxHostValid(ctx) {
  return ctx.host && ctx.protocol && ctx.host !== '127.0.0.1' && ctx.host !== 'localhost';
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(17)(app);
  const meta = {
    validation: {
      validators: {
        instance: {
          schemas: 'instance',
        },
      },
      keywords: {},
      schemas: {
        instance: schemas.instance,
      },
    },
    settings: {
      instance: {
        actionPath: 'instance/config',
      },
    },
  };
  return meta;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // instance
  schemas.instance = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Subdomain',
        ebReadOnly: true,
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
      },
      config: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Config',
        notEmpty: true,
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map