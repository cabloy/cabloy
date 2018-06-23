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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async status() {

      // get
      let value = await this.ctx.meta.status.get('__enable');
      assert(value === undefined);

      // set
      await this.ctx.meta.status.set('__enable', true);

      // get
      value = await this.ctx.meta.status.get('__enable');
      assert(value === true);

      // other module's status
      const moduleStatus = this.ctx.meta.status.module(this.ctx.module.info.relativeName);
      value = await moduleStatus.get('__enable');
      assert(value === true);

      // set
      await this.ctx.meta.status.set('__enable', false);

      // get
      value = await this.ctx.meta.status.get('__enable');
      assert(value === false);

      this.ctx.success();
    }

  }
  return TestController;
};



/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class StatusController extends app.Controller {

    async set() {
      const res = await this.ctx.service.status.set(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return StatusController;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(3);
const status = __webpack_require__(2);
const test = __webpack_require__(1);

module.exports = app => {
  let routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'status/set', controller: status, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      { method: 'get', path: 'test/status', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Status {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's status
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    async get(name) {
      const status = await ctx.db.get('aStatus', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      return status ? JSON.parse(status.value) : undefined;
    }

    async set(name, value) {
      await this._set({ name, value, queue: true });
    }

    async _set({ name, value, queue }) {
      const status = await ctx.db.get('aStatus', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      if (status) {
        await ctx.db.update('aStatus', {
          id: status.id,
          value: JSON.stringify(value),
        });
      } else {
        if (queue) {
          await ctx.app.meta.queue.pushAsync({
            subdomain: ctx.subdomain,
            module: moduleInfo.relativeName,
            queueName: 'statusSet',
            data: {
              module: this.moduleName,
              name,
              value,
            },
          });
        } else {
          await ctx.db.insert('aStatus', {
            iid: ctx.instance.id,
            module: this.moduleName,
            name,
            value: JSON.stringify(value),
          });
        }
      }
    }

  }

  return Status;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const StatusFn = __webpack_require__(5);
const STATUS = Symbol('CTX#__STATUS');

module.exports = () => {
  return async function status(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'status', {
      get() {
        if (ctx.meta[STATUS] === undefined) {
          ctx.meta[STATUS] = new (StatusFn(ctx))();
        }
        return ctx.meta[STATUS];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const status = __webpack_require__(6);

module.exports = {
  status,
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(9),
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    status: {
      global: true,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    statusSet: {
      path: 'status/set',
    },
  };

  return config;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class Status extends app.Service {

    async set({ module, name, value }) {
      const res = await this.ctx.meta.status.module(module)._set({ name, value, queue: false });
      return res;
    }

  }

  return Status;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aStatus
        const sql = `
          CREATE TABLE aStatus (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(13);
const status = __webpack_require__(12);

module.exports = {
  version,
  status,
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const services = __webpack_require__(14);
const config = __webpack_require__(11);
const locales = __webpack_require__(10);
const errors = __webpack_require__(8);
const middlewares = __webpack_require__(7);

// eslint-disable-next-line
module.exports = app => {

  const routes = __webpack_require__(4)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    middlewares,
  };

};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map