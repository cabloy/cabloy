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

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(5);
const middlewares = __webpack_require__(6);

module.exports = app => {

  // routes
  const routes = __webpack_require__(7)(app);
  // controllers
  const controllers = __webpack_require__(8)(app);
  // services
  const services = __webpack_require__(12)(app);
  // models
  const models = __webpack_require__(14)(app);
  // meta
  const meta = __webpack_require__(15)(app);

  return {
    routes,
    controllers,
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
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(3),
  'zh-cn': __webpack_require__(4),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  CaptchaInvalid: 'Verification code is invalid, please retrieve again',
  CaptchaMismatch: 'Mismatch Captcha Code',
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
  CaptchaInvalid: '验证码已失效，请重新获取',
  CaptchaMismatch: '验证码不匹配',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'CaptchaInvalid',
  1002: 'CaptchaMismatch',
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // captcha
    { method: 'get', path: 'captcha/image', controller: 'captcha' },
    { method: 'post', path: 'captcha/verify', controller: 'captcha', middlewares: 'inner' },
  ];
  return routes;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(9);
const captcha = __webpack_require__(10);

module.exports = app => {
  const controllers = {
    version,
    captcha,
  };
  return controllers;
};


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(11);
const captcha = require3('trek-captcha');

module.exports = app => {
  class CaptchaController extends app.Controller {

    async image() {
      // providerInstanceId
      const providerInstanceId = this.ctx.query.providerInstanceId;
      // create
      const { token, buffer } = await captcha();
      // update
      await this.ctx.bean.captcha.update({
        providerInstanceId, data: { token },
      });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/gif';
      this.ctx.body = buffer;
    }

    async verify() {
      // const { providerInstanceId, context } = this.ctx.request.body;
      const { data, dataInput } = this.ctx.request.body;
      if (!data) this.ctx.throw(1001);
      if (!dataInput.token || dataInput.token.toLowerCase() !== data.token.toLowerCase()) this.ctx.throw(1002);
      this.ctx.success();
    }

  }
  return CaptchaController;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(13);

module.exports = app => {
  const services = {
    version,
  };
  return services;
};


/***/ }),
/* 13 */
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
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(16)(app);
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
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map