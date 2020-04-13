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
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(8);
const mparse = require3('egg-born-mparse').default;
const extend = require3('extend2');
const uuid = require3('uuid');
const utils = __webpack_require__(9);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's captcha
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    async getProvider({ module, sceneName }) {
      // default scene
      const configDefault = ctx.config.module(moduleInfo.relativeName);
      const sceneDefault = configDefault.captcha.scenes.default;
      // module scene
      const configModule = ctx.config.module(module);
      const sceneModule = (configModule.captcha && configModule.captcha.scenes && configModule.captcha.scenes[sceneName]) || null;
      return extend(true, {}, sceneDefault, sceneModule);
    }

    // create provider instance
    async createProviderInstance({ module, sceneName, context }) {
      // provider
      const provider = await this.getProvider({ module, sceneName });
      // instance id
      const providerInstanceId = uuid.v4().replace(/-/g, '');
      // cache
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      await ctx.cache.db.module(moduleInfo.relativeName).set(key, { providerInstanceId, module, sceneName, context }, provider.timeout);
      // ok
      return { providerInstanceId, provider };
    }

    // get
    async getProviderInstance({ providerInstanceId }) {
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      return await cache.get(key);
    }

    // update
    async update({ providerInstanceId, data, context }) {
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await this.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // provider
      const provider = await this.getProvider({ module: providerInstance.module, sceneName: providerInstance.sceneName });
      // update
      providerInstance.data = data;
      providerInstance.context = context;
      await cache.set(key, providerInstance, provider.timeout);
    }

    async verify({ module, sceneName, providerInstanceId, dataInput }) {
      // cache
      const cache = ctx.cache.db.module(moduleInfo.relativeName);
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await this.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // check if the same scene
      if (module !== providerInstance.module || sceneName !== providerInstance.sceneName) ctx.throw(403);
      // provider
      const provider = await this.getProvider({ module: providerInstance.module, sceneName: providerInstance.sceneName });
      // invoke provider verify
      const _moduleInfo = mparse.parseInfo(provider.module);
      await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${provider.name}/verify`,
        body: {
          providerInstanceId,
          context: providerInstance.context,
          data: providerInstance.data,
          dataInput,
        },
      });
      // // clear
      // await cache.remove(key);
      // should hold the cache item
      // update
      providerInstance.data = null;
      await cache.set(key, providerInstance, provider.timeout);
    }

  }
  return Captcha;
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
  const routes = __webpack_require__(11)(app);
  // services
  const services = __webpack_require__(14)(app);
  // models
  const models = __webpack_require__(17)(app);
  // meta
  const meta = __webpack_require__(18)(app);

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
    captcha: {
      global: false,
      dependencies: 'auth,cachedb',
    },
    captchaVerify: {
      global: false,
      dependencies: 'auth,cachedb',
    },
  };

  // captcha scenes
  config.captcha = {
    scenes: {
      default: {
        module: 'a-captchasimple',
        name: 'captcha',
        timeout: 20 * 60 * 1000,
      },
    },
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
  'Scene Not Specified': '场景未指定',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Scene Not Specified',
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const captcha = __webpack_require__(7);
const captchaVerify = __webpack_require__(10);

module.exports = {
  captcha,
  captchaVerify,
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// captcha
const CaptchaFn = __webpack_require__(0);
const CAPTCHA = Symbol('CTX#__CAPTCHA');

module.exports = () => {
  return async function captcha(ctx, next) {
    ctx.meta = ctx.meta || {};
    // captchaContainer
    Object.defineProperty(ctx.meta, 'captcha', {
      get() {
        if (ctx.meta[CAPTCHA] === undefined) {
          ctx.meta[CAPTCHA] = new (CaptchaFn(ctx))();
        }
        return ctx.meta[CAPTCHA];
      },
    });
    // next
    await next();
  };
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
  getCacheKey({ ctx, providerInstanceId }) {
    return `captcha:${ctx.meta.user.anonymousId()}:${providerInstanceId}`;
  },
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const CaptchaFn = __webpack_require__(0);

module.exports = (options2, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function captchaVerify(ctx, next, options) {
    // must exists
    const scene = options.scene;
    const scenes = options.scenes;
    if (!scene && !scenes) ctx.throw.module(moduleInfo.relativeName, 1001);

    // scene
    if (scene) {
      await sceneVerify({ ctx, scene });
    } else if (scenes) {
      for (const scene of scenes) {
        await sceneVerify({ ctx, scene });
      }
    }

    // next
    await next();
  };
};

async function sceneVerify({ ctx, scene }) {
  // params
  const module = scene.module || ctx.module.info.relativeName;
  const sceneName = scene.name;
  const captchaData = ctx.request.body[scene.dataKey || 'captcha'];
  const providerInstanceId = captchaData.providerInstanceId;
  const dataInput = captchaData.data;
  // verify
  try {
    const _captcha = new (CaptchaFn(ctx))();
    await _captcha.verify({ module, sceneName, providerInstanceId, dataInput });
  } catch (err) {
    throw combineCaptchaError({
      fieldKey: scene.fieldKey || 'token',
      message: err.message,
    });
  }
}

function combineCaptchaError({ fieldKey, message }) {
  // error
  const error = new Error();
  error.code = 422;
  error.message = [
    {
      keyword: 'x-captcha',
      params: [],
      message,
      dataPath: `/captcha/${fieldKey}`,
      schemaPath: `#/properties/captcha/${fieldKey}/x-captcha`,
    },
  ];
  return error;
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(12);
const captcha = __webpack_require__(13);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // captcha
    { method: 'post', path: 'captcha/createProviderInstance', controller: captcha, middlewares: 'captcha' },
  ];
  return routes;
};


/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {
  class CaptchaController extends app.Controller {

    async createProviderInstance() {
      const res = await this.service.captcha.createProviderInstance({
        module: this.ctx.request.body.module,
        sceneName: this.ctx.request.body.sceneName,
        context: this.ctx.request.body.context,
      });
      this.ctx.success(res);
    }

  }
  return CaptchaController;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(15);
const captcha = __webpack_require__(16);

module.exports = app => {
  const services = {
    version,
    captcha,
  };
  return services;
};


/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {

  class Captcha extends app.Service {

    async createProviderInstance({ module, sceneName, context }) {
      return await this.ctx.meta.captcha.createProviderInstance({ module, sceneName, context });
    }

  }

  return Captcha;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(19)(app);
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
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map