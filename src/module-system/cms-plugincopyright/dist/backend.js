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
  // services
  const services = __webpack_require__(10)(app);
  // models
  const models = __webpack_require__(12)(app);
  // meta
  const meta = __webpack_require__(13)(app);

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
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
    default: 'simple',
    license: {
      link: 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
      version: 'BY-NC-SA 4.0',
      content: null,
    },
    titles: {
      title: 'Title',
      author: 'Author',
      createdAt: 'Created Time',
      updatedAt: 'Modification Time',
      link: 'Link',
      markdown: 'MarkdownSource',
      license: 'CopyrightLicenseTitle',
    },
    values: {
      author: null,
    },
    copyrights: {
      none: null,
      simple: {
        fields: 'author,link,markdown',
      },
      license: {
        fields: 'author,link,markdown,license',
      },
      full: {
        fields: 'title,author,createdAt,updatedAt,link,markdown,license',
      },
    },
  };

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
  MarkdownSource: 'Markdown Source',
  CopyrightLicenseTitle: 'Copyright Notice',
  CopyrightLicenseContent: 'All articles in this website are licensed under %s unless stating additionally.',
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
  Title: '标题',
  Author: '作者',
  Link: '链接',
  'Created Time': '创建时间',
  'Modification Time': '修改时间',
  MarkdownSource: 'Markdown源文件',
  CopyrightLicenseTitle: '版权声明',
  CopyrightLicenseContent: '本站所有文章除特别声明外，均采用 %s 许可协议。转载请注明出处！',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(8);
const util = __webpack_require__(9);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // util
    { method: 'get', path: 'util/md/:atomId', controller: util, action: 'md' },
  ];
  return routes;
};


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {

  class UtilController extends app.Controller {

    async md() {
      // atomId
      const atomId = this.ctx.params.atomId;
      // article
      const article = await this.ctx.meta.atom.read({ key: { atomId }, user: this.ctx.user.op });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // ok
      this.ctx.status = 200;
      this.ctx.body = article.content;
      this.ctx.set('content-type', 'text/x-markdown; charset=UTF-8');
    }

  }
  return UtilController;
};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);

module.exports = app => {
  const services = {
    version,
  };
  return services;
};


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(14)(app);
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
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map