/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 581:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */
var Strategy = __webpack_require__(703);


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;


/***/ }),

/***/ 703:
/***/ ((module) => {

/**
 * Creates an instance of `Strategy`.
 *
 * @constructor
 * @api public
 */
function Strategy() {
}

/**
 * Authenticate request.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} req The request to authenticate.
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
Strategy.prototype.authenticate = function(req, options) {
  throw new Error('Strategy#authenticate must be overridden by subclass');
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;


/***/ }),

/***/ 372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const Strategy = require3('passport-github').Strategy;
const StrategyMock = __webpack_require__(706);

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    async getConfigDefault() {
      const configGitHub = this.configModule.account.github;
      return {
        scenes: configGitHub.scenes,
      };
    }
    checkConfigValid(config) {
      return this.allowStrategyMock || (!!config.clientID && !!config.clientSecret);
    }
    getStrategy() {
      return this.allowStrategyMock ? StrategyMock : Strategy;
    }
    async onVerify(accessToken, refreshToken, profile) {
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: profile.id,
        profile: {
          userName: profile.username,
          realName: profile.displayName,
          avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
          accessToken,
          refreshToken,
          profile,
        },
      };
    }
  }

  return Provider;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
      if (options.version === 2) {
        // all instances
        const instances = await this.ctx.bean.instance.list({ where: {} });
        for (const instance of instances) {
          await this.ctx.meta.util.executeBean({
            subdomain: instance.name,
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.version.manager`,
            context: options,
            fn: 'update8Auths',
          });
        }
      }
    }

    async init(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async update8Auths(options) {
      const provideItem = await this.ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authgithub',
      });
      await this.ctx.model.query('update aAuth a set a.providerScene=? where a.iid=? and a.providerId=?', [
        'default',
        this.ctx.instance.id,
        provideItem.id,
      ]);
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const authProviderGithub = __webpack_require__(372);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // auth.provider
    'auth.provider.github': {
      mode: 'ctx',
      bean: authProviderGithub,
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
    scenes: {
      default: {
        title: 'AuthDefault',
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

/***/ 443:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  function _createProvider() {
    return {
      meta: {
        title: 'GitHub',
        mode: 'redirect',
        scene: true,
        bean: 'github',
        render: 'buttonGithub',
        validator: {
          module: 'a-auth',
          validator: 'oauth2',
        },
        icon: { f7: ':auth:github' },
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

/***/ 706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const passport = __webpack_require__(581);
const util = __webpack_require__(837);

function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('LocalStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'github-mock';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function (req) {
  // self
  const self = this;
  const ctx = req.ctx;

  // check
  if (req.method === 'POST') {
    // not allow
    return self.error(ctx.parseFail(403));
  }

  // verified
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    ctx.success(user);
    self.success(user, info);
  }

  // mock
  const mockId = 'mock-github-user';
  const profile = {
    id: mockId,
    username: mockId,
    displayName: mockId,
  };
  const accessToken = null;
  const refreshToken = null;

  try {
    if (self._passReqToCallback) {
      this._verify(req, accessToken, refreshToken, profile, verified);
    } else {
      this._verify(accessToken, refreshToken, profile, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

module.exports = Strategy;


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
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

const authFn = __webpack_require__(443);
module.exports = app => {
  // schemas
  const schemas = __webpack_require__(232)(app);
  return {
    auth: authFn,
    validation: {
      validators: {},
      schemas,
    },
  };
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = {};


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

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

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