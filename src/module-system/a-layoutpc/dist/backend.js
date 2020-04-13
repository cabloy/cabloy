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

const routes = __webpack_require__(1);
const services = __webpack_require__(3);
const config = __webpack_require__(5);
const locales = __webpack_require__(6);
const errors = __webpack_require__(9);

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = __webpack_require__(10)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    meta,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(2);

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
];


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(4);

module.exports = {
  version,
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    // eslint-disable-next-line
    async update(options) {
    }

    async init(options) {

      if (options.version === 1) {

        // roleFunctions: panels
        const rolePanels = [
          { roleName: null, name: 'panelMenu' },
          { roleName: null, name: 'panelAtom' },
          { roleName: null, name: 'panelSearch' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions: rolePanels });

        // roleFunctions: sections
        const roleSections = [
          { roleName: null, name: 'sectionCopyright' },
          { roleName: null, name: 'sectionClock' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleSections });

        // roleFunctions: buttons
        const roleButtons = [
          { roleName: null, name: 'buttonDashboard' },
          { roleName: null, name: 'buttonFullscreen' },
          { roleName: null, name: 'buttonMine' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions: roleButtons });

      }

    }

  }

  return Version;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  return config;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(7),
  'zh-cn': __webpack_require__(8),
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
  Copyright: '版权',
  Clock: '时钟',
  Dashboard: '仪表盘',
  Mine: '我的',
  Fullscreen: '全屏',
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  // meta
  const meta = {
    base: {
      functions: {
        // panels
        panelMenu: {
          title: 'Menu',
          url: '/a/base/menu/list',
          menu: 2,
          public: 1,
        },
        panelAtom: {
          title: 'Atom',
          url: '/a/base/atom/list',
          menu: 2,
          public: 1,
        },
        panelSearch: {
          title: 'Search',
          url: '/a/base/atom/searchQuick',
          menu: 2,
          public: 1,
        },
        // sections
        sectionCopyright: {
          title: 'Copyright',
          component: 'sectionCopyright',
          menu: 4,
          public: 1,
        },
        sectionClock: {
          title: 'Clock',
          component: 'sectionClock',
          menu: 4,
          public: 1,
        },
        // header buttons
        buttonDashboard: {
          title: 'Dashboard',
          component: 'buttonDashboard',
          menu: 5,
          public: 1,
        },
        buttonFullscreen: {
          title: 'Fullscreen',
          component: 'buttonFullscreen',
          menu: 5,
          public: 1,
        },
        buttonMine: {
          title: 'Mine',
          component: 'buttonMine',
          menu: 5,
          public: 1,
        },
      },
    },
  };
  return meta;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map