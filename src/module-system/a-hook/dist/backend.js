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
  const meta = __webpack_require__(9)(app);
  const routes = __webpack_require__(10)(app);

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

const hook = __webpack_require__(2);

module.exports = {
  hook,
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class Hook extends app.Service {

    // register all hooks
    async registerAllHooks() {
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.hook) {
          this._registerHooks(module, 'before');
          this._registerHooks(module, 'after');
        }
      }
    }

    async _registerHooks(module, stage) {
      const hooksStage = module.main.meta.hook[stage];
      if (!hooksStage) return;
      const hooks = this.app.meta.geto('hooks').geto(stage);
      for (const hook of hooksStage) {
        hooks.geta(hook.path).push({ route: `/${module.info.url}/${hook.route}` });
      }
    }

  }

  return Hook;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    hook: {
      global: true,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    installHooks: {
      type: 'all',
      path: 'hook/installHooks',
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

const hook = __webpack_require__(8);

module.exports = {
  hook,
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = () => {
  return async function hook(ctx, next) {
    // before
    await invokeHooks(ctx, 'before');
    // next
    await next();
    // after
    await invokeHooks(ctx, 'after');
  };
};

async function invokeHooks(ctx, stage) {
  if (!ctx.route) return;
  const path = `/${ctx.route.pid}/${ctx.route.module}/${ctx.route.controller}/${ctx.route.action}`;
  const hooks = ctx.app.meta.geto('hooks').geto(stage).geta(path);
  for (const hook of hooks) {
    await ctx.performAction({
      method: 'post',
      url: hook.route,
    });
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {
  const meta = {};
  if (app.meta.isTest) {
    Object.assign(meta, {
      hook: {
        before: [
          { path: '/a/base/auth/echo', route: 'test/hookTestBefore' },
        ],
        after: [
          { path: '/a/base/auth/echo', route: 'test/hookTestAfter' },
        ],
      },
    });
  }
  return meta;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const test = __webpack_require__(11);
const hook = __webpack_require__(12);

module.exports = app => {
  let routes = [
    { method: 'post', path: 'hook/installHooks', controller: hook, middlewares: 'inner',
      meta: {
        instance: { enable: false },
      },
    },
  ];
  if (app.meta.isTest) {
    routes = routes.concat([
      { method: 'post', path: 'test/test', controller: test, middlewares: 'test' },
      { method: 'post', path: 'test/hookTestBefore', controller: test, middlewares: 'test' },
      { method: 'post', path: 'test/hookTestAfter', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {
  class TestController extends app.Controller {

    async test() {
      this.ctx.success();
    }

    async hookTestBefore() {
      console.log('hook:before', this.ctx.ctxCaller.route);
      this.ctx.success();
    }
    async hookTestAfter() {
      console.log('hook:after', this.ctx.ctxCaller.route);
      this.ctx.success();
    }

  }
  return TestController;
};



/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class HookController extends app.Controller {

    async installHooks() {
      // register all hooks
      await this.ctx.service.hook.registerAllHooks();
      this.ctx.success();
    }

  }

  return HookController;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map