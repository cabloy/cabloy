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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const services = __webpack_require__(1);
const config = __webpack_require__(3);
const locales = __webpack_require__(4);
const errors = __webpack_require__(6);
const middlewares = __webpack_require__(7);

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = __webpack_require__(10)(app);
  const routes = __webpack_require__(11)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    middlewares,
    meta,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const event = __webpack_require__(2);

module.exports = {
  event,
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class Event extends app.Service {

    // register all events
    async registerAllEvents() {
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.event && module.main.meta.event.implementations) {
          this._registerEvents(module, module.main.meta.event.implementations);
        }
      }
    }

    async _registerEvents(module, implementations) {
      const events = this.app.meta.geto('events');
      for (const key in implementations) {
        events.geta(key).push(`/${module.info.url}/${implementations[key]}`);
      }
    }

  }

  return Event;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    event: {
      global: true,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    installEvents: {
      path: 'event/installEvents',
    },
  };

  return config;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(5),
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const event = __webpack_require__(8);

module.exports = {
  event,
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const EventFn = __webpack_require__(9);
const EVENT = Symbol('CTX#EVENT');

module.exports = () => {
  return async function event(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'event', {
      get() {
        if (ctx.meta[EVENT] === undefined) {
          ctx.meta[EVENT] = new (EventFn(ctx))();
        }
        return ctx.meta[EVENT];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

const Fn = module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Event {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's event
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // support: returnValue / event.break
    async invoke({ module, name, data }) {
      //
      module = module || this.moduleName;
      const key = `${module}:${name}`;
      const events = ctx.app.meta.geto('events');
      const eventArray = events[key];
      if (!eventArray) return;
      //
      let returnValue;
      for (const eventUrl of eventArray) {
        const event = {
          break: false,
        };
        const res = await ctx.performAction({
          method: 'post',
          url: eventUrl,
          body: { event, data },
        });
        // check returnValue
        if (res !== undefined) returnValue = res;
        // check break
        if (event.break) break;
      }
      // ok
      return returnValue;
    }

  }

  return Event;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  const meta = {};
  return meta;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const event = __webpack_require__(12);

module.exports = app => {
  const routes = [
    { method: 'post', path: 'event/installEvents', controller: event, middlewares: 'inner',
      meta: {
        instance: { enable: false },
      },
    },
  ];
  return routes;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class EventController extends app.Controller {

    async installEvents() {
      // register all events
      await this.ctx.service.event.registerAllEvents();
      this.ctx.success();
    }

  }

  return EventController;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map