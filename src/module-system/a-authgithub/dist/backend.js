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
      const models = __webpack_require__(5);
      const config = __webpack_require__(6);
      const locales = __webpack_require__(7);
      const errors = __webpack_require__(9);
      const metaFn = __webpack_require__(10);

      module.exports = app => {
        return {
          routes,
          services,
          models,
          config,
          locales,
          errors,
          meta: metaFn(app),
        };
      };


      /***/ },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {

      const version = __webpack_require__(2);

      module.exports = [
        { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
        { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
      ];


      /***/ },
    /* 2 */
    /***/ function(module, exports) {

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


      /***/ },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {

      const version = __webpack_require__(4);
      module.exports = {
        version,
      };


      /***/ },
    /* 4 */
    /***/ function(module, exports) {

      module.exports = app => {
        class Version extends app.Service {

          async update(options) {
            // eslint-disable-next-line
      if (options.version === 1) {}
          }

          async init(options) {
            if (options.version === 1) {}
          }

        }

        return Version;
      };


      /***/ },
    /* 5 */
    /***/ function(module, exports) {

      module.exports = {
      };


      /***/ },
    /* 6 */
    /***/ function(module, exports) {

      // eslint-disable-next-line
module.exports = appInfo => {
        const config = {
        };
        return config;
      };


      /***/ },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {

      module.exports = {
        'zh-cn': __webpack_require__(8),
      };


      /***/ },
    /* 8 */
    /***/ function(module, exports) {

      module.exports = {
        'Auth-GitHub': '认证-GitHub',
      };


      /***/ },
    /* 9 */
    /***/ function(module, exports) {

      // error code should start from 1001
      module.exports = {
      };


      /***/ },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {

      const authFn = __webpack_require__(11);
      module.exports = app => {
        return {
          auth: authFn(app),
        };
      };


      /***/ },
    /* 11 */
    /***/ function(module, exports, __webpack_require__) {

      const require3 = __webpack_require__(12);
      const strategy = require3('passport-github').Strategy;
      module.exports = app => {
        const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
        const provider = moduleInfo.name;
        return {
          providers: {
            [provider]: {
              meta: {
                title: 'GitHub',
                mode: 'redirect',
                component: 'button',
              },
              config: {
                clientID: '[required]',
                clientSecret: '[required]',
              },
              handler: app => {
                return {
                  strategy,
                  callback: (req, accessToken, refreshToken, params, profile, done) => {
                    const user = {
                      module: moduleInfo.relativeName,
                      provider,
                      profileId: profile.id,
                      profile: {
                        userName: profile.username,
                        realName: profile.displayName,
                        avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
                        accessToken,
                        refreshToken,
                        params,
                        profile,
                      },
                    };
                    app.passport.doVerify(req, user, done);
                  },
                };
              },
            },
          },
        };
      };


      /***/ },
    /* 12 */
    /***/ function(module, exports) {

      module.exports = require('require3');

      /***/ },
    /** ****/ ]);
// # sourceMappingURL=backend.js.map
