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

module.exports = {
  getCacheKey({ user }) {
    return `captcha:${user.id}`;
  },
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(2);
const locales = __webpack_require__(3);
const errors = __webpack_require__(5);
const middlewares = __webpack_require__(6);

module.exports = app => {

  // routes
  const routes = __webpack_require__(10)(app);
  // services
  const services = __webpack_require__(13)(app);
  // models
  const models = __webpack_require__(16)(app);
  // meta
  const meta = __webpack_require__(17)(app);

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    meta,
  };

};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    captchaContainer: {
      global: false,
      dependencies: 'cachedb',
    },
    captchaVerify: {
      global: false,
      dependencies: 'auth,cachedb',
    },
  };

  // provider
  config.provider = {
    module: 'a-captchasimple',
    name: 'simple',
  };

  // cache timeout
  config.cache = {
    timeout: 20 * 60 * 1000,
  };

  return config;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(4),
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
  'Mismatch Captcha Code': '验证码不匹配',
  'Verification code is invalid, please retrieve again': '验证码已失效，请重新获取',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const captchaContainer = __webpack_require__(7);
const captchaVerify = __webpack_require__(9);

module.exports = {
  captchaContainer,
  captchaVerify,
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// captchaContainer
const CaptchaContainerFn = __webpack_require__(8);
const CaptchaController = Symbol('CTX#__CaptchaController');


module.exports = () => {
  return async function captchaContainer(ctx, next) {
    ctx.meta = ctx.meta || {};
    // captchaContainer
    Object.defineProperty(ctx.meta, 'captcha', {
      get() {
        if (ctx.meta[CaptchaController] === undefined) {
          ctx.meta[CaptchaController] = new (CaptchaContainerFn(ctx))();
        }
        return ctx.meta[CaptchaController];
      },
    });
    // next
    await next();
  };
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(0);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CaptchaContainer {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's mail
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // save
    async save({ provider, code }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName);
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      // timeout
      const timeout = config.cache.timeout;
      // user
      const user = ctx.user.agent;
      // get
      const key = utils.getCacheKey({ user });
      const value = await cache.get(key);
      console.log(value);
      if (!value) ctx.throw(403);
      // verify provider
      if (provider.module !== value.provider.module || provider.name !== value.provider.name) ctx.throw(403);
      // save
      value.code = code;
      await cache.set(key, value, timeout);
    }

  }
  return CaptchaContainer;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(0);

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function captchaVerify(ctx, next) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName);
    // cache
    const cache = ctx.cache.db.module(moduleInfo.relativeName);
    // timeout
    const timeout = config.cache.timeout;
    // user
    const user = ctx.user.agent;
    // get
    const key = utils.getCacheKey({ user });
    const value = await cache.get(key);
    if (!value || !value.code) {
      // error
      throw combineCaptchaError({
        message: ctx.text('Verification code is invalid, please retrieve again'),
      });
    }
    // verify
    if (ctx.request.body.captcha.code !== value.code) {
      // error
      throw combineCaptchaError({
        message: ctx.text('Mismatch Captcha Code'),
      });
    }
    // clear
    // await cache.remove(key);
    value.code = undefined;
    await cache.set(key, value, timeout);

    // next
    await next();
  };
};

function combineCaptchaError({ message }) {
  // error
  const error = new Error();
  error.code = 422;
  error.message = [
    {
      keyword: 'x-captcha',
      params: [],
      message,
      dataPath: '/captcha/code',
      schemaPath: '#/properties/captcha/code/x-captcha',
    },
  ];
  return error;
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const captcha = __webpack_require__(12);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // captcha
    { method: 'post', path: 'captcha/getProvider', controller: captcha },
  ];
  return routes;
};


/***/ }),
/* 11 */
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

    async test() {
      await this.service.version.test(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {
  class CaptchaController extends app.Controller {

    async getProvider() {
      const res = await this.service.captcha.getProvider({
        user: this.ctx.user.agent,
      });
      this.ctx.success(res);
    }

  }
  return CaptchaController;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(14);
const captcha = __webpack_require__(15);

module.exports = app => {
  const services = {
    version,
    captcha,
  };
  return services;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(0);

module.exports = app => {

  class Captcha extends app.Service {

    async getProvider({ user }) {
      // timeout
      const timeout = this.ctx.config.cache.timeout;
      // provider
      const provider = this.ctx.config.provider;
      // cache
      const key = utils.getCacheKey({ user });
      await this.ctx.cache.db.set(key, { provider }, timeout);
      // ok
      return { provider };
    }

  }

  return Captcha;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(18)(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
  };
  return meta;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map