module.exports =
/** ****/ (function(modules) { // webpackBootstrap
    /** ****/ 	// The module cache
    /** ****/ 	const installedModules = {};
    /** ****/
    /** ****/ 	// The require function
    /** ****/ 	function __webpack_require__(moduleId) {
      /** ****/
      /** ****/ 		// Check if module is in cache
      /** ****/ 		if (installedModules[moduleId]) {
        /** ****/ 			return installedModules[moduleId].exports;
        /** ****/ 		}
      /** ****/ 		// Create a new module (and put it into the cache)
      /** ****/ 		const module = installedModules[moduleId] = {
        /** ****/ 			i: moduleId,
        /** ****/ 			l: false,
        /** ****/ 			exports: {},
        /** ****/ 		};
      /** ****/
      /** ****/ 		// Execute the module function
      /** ****/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /** ****/
      /** ****/ 		// Flag the module as loaded
      /** ****/ 		module.l = true;
      /** ****/
      /** ****/ 		// Return the exports of the module
      /** ****/ 		return module.exports;
      /** ****/ 	}
    /** ****/
    /** ****/
    /** ****/ 	// expose the modules object (__webpack_modules__)
    /** ****/ 	__webpack_require__.m = modules;
    /** ****/
    /** ****/ 	// expose the module cache
    /** ****/ 	__webpack_require__.c = installedModules;
    /** ****/
    /** ****/ 	// define getter function for harmony exports
    /** ****/ 	__webpack_require__.d = function(exports, name, getter) {
      /** ****/ 		if (!__webpack_require__.o(exports, name)) {
        /** ****/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /** ****/ 		}
      /** ****/ 	};
    /** ****/
    /** ****/ 	// define __esModule on exports
    /** ****/ 	__webpack_require__.r = function(exports) {
      /** ****/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** ****/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /** ****/ 		}
      /** ****/ 		Object.defineProperty(exports, '__esModule', { value: true });
      /** ****/ 	};
    /** ****/
    /** ****/ 	// create a fake namespace object
    /** ****/ 	// mode & 1: value is a module id, require it
    /** ****/ 	// mode & 2: merge all properties of value into the ns
    /** ****/ 	// mode & 4: return value when already ns object
    /** ****/ 	// mode & 8|1: behave like require
    /** ****/ 	__webpack_require__.t = function(value, mode) {
      /** ****/ 		if (mode & 1) value = __webpack_require__(value);
      /** ****/ 		if (mode & 8) return value;
      /** ****/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      /** ****/ 		const ns = Object.create(null);
      /** ****/ 		__webpack_require__.r(ns);
      /** ****/ 		Object.defineProperty(ns, 'default', { enumerable: true, value });
      /** ****/ 		if (mode & 2 && typeof value !== 'string') for (const key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
      /** ****/ 		return ns;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// getDefaultExport function for compatibility with non-harmony modules
    /** ****/ 	__webpack_require__.n = function(module) {
      /** ****/ 		const getter = module && module.__esModule ?
      /** ****/ 			function getDefault() { return module.default; } :
      /** ****/ 			function getModuleExports() { return module; };
      /** ****/ 		__webpack_require__.d(getter, 'a', getter);
      /** ****/ 		return getter;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// Object.prototype.hasOwnProperty.call
    /** ****/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /** ****/
    /** ****/ 	// __webpack_public_path__
    /** ****/ 	__webpack_require__.p = '';
    /** ****/
    /** ****/
    /** ****/ 	// Load entry module and return exports
    /** ****/ 	return __webpack_require__(__webpack_require__.s = 0);
    /** ****/ })([
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {

      const routes = __webpack_require__(1);
      const services = __webpack_require__(3);
      const config = __webpack_require__(5);
      const locales = __webpack_require__(6);
      const errors = __webpack_require__(8);

      // eslint-disable-next-line
module.exports = (app,module) => {

        //
        return {
          routes,
          services,
          config,
          locales,
          errors,
        };

      };


      /***/ },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {

      const auth = __webpack_require__(2);

      module.exports = [
        // auth
        { method: 'post', path: 'auth/list', controller: 'auth' },
      ];


      /***/ },
    /* 2 */
    /***/ function(module, exports) {

      module.exports = app => {
        class AuthController extends app.Controller {

          async list() {
            const res = await this.service.auth.list();
            this.ctx.success(res);
          }

        }
        return AuthController;
      };


      /***/ },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {

      const auth = __webpack_require__(4);

      module.exports = {
        auth,
      };


      /***/ },
    /* 4 */
    /***/ function(module, exports) {

      module.exports = app => {

        class Auth extends app.Service {

          async list() {
            // list
            const list = await this.ctx.model.query(`
        select a.id, a.module,a.providerName from aAuthProvider a
          where a.iid=? and a.disabled=0
        `, [ this.ctx.instance.id ]);
            // list map
            const listMap = {};
            // meta
            const authProviders = this.ctx.bean.base.authProviders();
            for (const item of list) {
              const key = `${item.module}:${item.providerName}`;
              const authProvider = authProviders[key];
              item.meta = authProvider.meta;
              listMap[key] = item;
            }
            // order
            const res = [];
            for (const item of this.ctx.config.providers) {
              const key = `${item.module}:${item.provider}`;
              const provider = listMap[key];
              if (provider) {
                if (item.disable !== true) {
                  res.push(provider);
                }
                delete listMap[key];
              }
            }
            // the rest
            for (const key in listMap) {
              res.push(listMap[key]);
            }
            // ok
            return res;
          }

        }

        return Auth;
      };


      /***/ },
    /* 5 */
    /***/ function(module, exports) {

      // eslint-disable-next-line
module.exports = appInfo => {
        const config = {};

        // providers
        config.providers = [
          {
            module: 'a-authsimple',
            provider: 'authsimple',
          },
          {
            module: 'a-authgithub',
            provider: 'authgithub',
          },
        ];

        return config;
      };


      /***/ },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {

      module.exports = {
        'zh-cn': __webpack_require__(7),
      };


      /***/ },
    /* 7 */
    /***/ function(module, exports) {

      module.exports = {
      };


      /***/ },
    /* 8 */
    /***/ function(module, exports) {

      // error code should start from 1001
      module.exports = {
      };


      /***/ },
    /** ****/ ]);
// # sourceMappingURL=backend.js.map
