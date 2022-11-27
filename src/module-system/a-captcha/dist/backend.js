/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 760:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const mparse = require3('egg-born-mparse').default;
const extend = require3('@zhennann/extend');
const uuid = require3('uuid');
const utils = __webpack_require__(294);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'captcha');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get cacheModule() {
      return ctx.cache.db.module(moduleInfo.relativeName);
    }

    async getProvider({ module, sceneName }) {
      // default scene
      const sceneDefault = this.configModule.captcha.scenes.default;
      // module scene
      const configModuleScene = ctx.config.module(module);
      const sceneModule = ctx.bean.util.getProperty(configModuleScene, `captcha.scenes.${sceneName}`) || null;
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
      await this.cacheModule.set(key, { providerInstanceId, module, sceneName, context }, provider.timeout);
      // ok
      return { providerInstanceId, provider };
    }

    // get
    async getProviderInstance({ providerInstanceId }) {
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      return await this.cacheModule.get(key);
    }

    // update
    async update({ providerInstanceId, data, context }) {
      // key
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await this.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // provider
      const provider = await this.getProvider({
        module: providerInstance.module,
        sceneName: providerInstance.sceneName,
      });
      // update
      providerInstance.data = data;
      providerInstance.context = context;
      await this.cacheModule.set(key, providerInstance, provider.timeout);
    }

    async verify({ module, sceneName, providerInstanceId, dataInput }) {
      // key
      const key = utils.getCacheKey({ ctx, providerInstanceId });
      // get
      const providerInstance = await this.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // check if the same scene
      if (module !== providerInstance.module || sceneName !== providerInstance.sceneName) ctx.throw(403);
      // provider
      const provider = await this.getProvider({
        module: providerInstance.module,
        sceneName: providerInstance.sceneName,
      });
      // invoke provider verify
      const _moduleInfo = mparse.parseInfo(provider.module);
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName: `${_moduleInfo.relativeName}.captcha.provider.${provider.name}`,
        context: {
          providerInstanceId,
          context: providerInstance.context,
          data: providerInstance.data,
          dataInput,
        },
        fn: 'verify',
      });
      // // clear
      // await cache.remove(key);
      // should hold the cache item
      // update
      providerInstance.data = null;
      await this.cacheModule.set(key, providerInstance, provider.timeout);
    }
  }
  return Captcha;
};


/***/ }),

/***/ 45:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // must exists
      const scene = options.scene;
      const scenes = options.scenes;
      if (!scene && !scenes) ctx.throw.module(moduleInfo.relativeName, 1001);

      // local.disabled
      if (ctx.app.meta.isLocal && ctx.config.module(moduleInfo.relativeName).configFront.local.disabled) {
        // next
        return await next();
      }

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
    }
  }
  return Middleware;
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
    await ctx.bean.captcha.verify({ module, sceneName, providerInstanceId, dataInput });
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

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const middlewareCaptchaVerify = __webpack_require__(45);
const beanCaptcha = __webpack_require__(760);

module.exports = app => {
  const beans = {
    // middleware
    'middleware.captchaVerify': {
      mode: 'ctx',
      bean: middlewareCaptchaVerify,
    },
    // global
    captcha: {
      mode: 'ctx',
      bean: beanCaptcha,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 294:
/***/ ((module) => {

module.exports = {
  getCacheKey({ ctx, providerInstanceId }) {
    return `captcha:${ctx.bean.user.anonymousId()}:${providerInstanceId}`;
  },
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    captchaVerify: {
      bean: 'captchaVerify',
      global: false,
      dependencies: 'auth',
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

  // configFront
  config.configFront = {
    local: {
      disabled: false,
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Scene Not Specified',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Scene Not Specified': '场景未指定',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 820:
/***/ ((module) => {

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

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const captcha = __webpack_require__(820);

module.exports = app => {
  const controllers = {
    captcha,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
  };
  return meta;
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {};
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // captcha
    { method: 'post', path: 'captcha/createProviderInstance', controller: 'captcha' },
  ];
  return routes;
};


/***/ }),

/***/ 68:
/***/ ((module) => {

module.exports = app => {
  class Captcha extends app.Service {
    async createProviderInstance({ module, sceneName, context }) {
      return await this.ctx.bean.captcha.createProviderInstance({ module, sceneName, context });
    }
  }

  return Captcha;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const captcha = __webpack_require__(68);

module.exports = app => {
  const services = {
    captcha,
  };
  return services;
};


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