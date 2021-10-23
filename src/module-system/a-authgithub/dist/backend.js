/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // empty
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // account
  config.account = {};

  // account.github
  config.account.github = {
    apps: {
      default: {
        clientID: '',
        clientSecret: '',
      },
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Auth-GitHub': '认证-GitHub',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 95:
/***/ ((module) => {

module.exports = app => {
  const controllers = {};
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const routes = __webpack_require__(825);
const services = __webpack_require__(214);
const models = __webpack_require__(230);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const metaFn = __webpack_require__(458);

module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta: metaFn(app),
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authFn = __webpack_require__(441);
module.exports = app => {
  return {
    auth: authFn,
  };
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 441:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const strategy = require3('passport-github').Strategy;
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider() {
    const config = ctx.config.module(moduleInfo.relativeName).account.github.apps.default;
    if (!config.clientID || !config.clientSecret) return null;
    return {
      meta: {
        title: 'GitHub',
        mode: 'redirect',
        component: 'buttongithub',
      },
      config: {},
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.github.apps.default;
          return { clientID: config.clientID, clientSecret: config.clientSecret };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, accessToken, refreshToken, params, profile, done) => {
            const user = {
              module: moduleInfo.relativeName,
              provider: 'authgithub',
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
    };
  }

  const metaAuth = {
    providers: {
      authgithub: _createProvider(),
    },
  };

  // ok
  return metaAuth;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = [];


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map