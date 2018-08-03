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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = () => {
  return async function instance(ctx, next) {

    const timeout = ctx.config.module('a-instance').cache.timeout;
    let instance = timeout > 0 ? ctx.cache.mem.get('instance') : null;
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance && timeout > 0) {
        ctx.cache.mem.set('instance', instance, timeout);
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const instance = __webpack_require__(0);

module.exports = {
  instance,
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(3),
};


/***/ }),
/* 5 */
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
    timeout: 1 * 24 * 3600 * 1000, // 1 天
  };

  return config;
};


/***/ }),
/* 6 */
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
    }

    async init(options) {
      if (options.version === 1) {
        await this.ctx.db.insert('aInstance', { name: options.subdomain, disabled: 0 });
      }
    }

  }

  return Version;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(6);

module.exports = {
  version,
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(8);
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
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(10);
const test = __webpack_require__(9);

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'get', path: 'test/instance', controller: test, middlewares: 'test' },
];


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const routes = __webpack_require__(11);
const services = __webpack_require__(7);
const config = __webpack_require__(5);
const locales = __webpack_require__(4);
const errors = __webpack_require__(2);
const middlewares = __webpack_require__(1);

// eslint-disable-next-line
module.exports = app => {

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