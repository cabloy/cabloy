/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 952:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha {

    async verify(context) {
      const { data, dataInput } = context;
      if (!data) ctx.throw.module(moduleInfo.relativeName, 1001);
      if (!dataInput.token || dataInput.token.toLowerCase() !== data.token.toLowerCase()) ctx.throw.module(moduleInfo.relativeName, 1002);
    }

  }
  return Captcha;
};



/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const captchaProvider = __webpack_require__(952);

module.exports = app => {
  const beans = {
    // captcha.provider
    'captcha.provider.captcha': {
      mode: 'ctx',
      bean: captchaProvider,
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
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'CaptchaInvalid',
  1002: 'CaptchaMismatch',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  CaptchaInvalid: 'Verification code is invalid, please retrieve again',
  CaptchaMismatch: 'Mismatch Captcha Code',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  CaptchaInvalid: '验证码已失效，请重新获取',
  CaptchaMismatch: '验证码不匹配',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
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
      atoms: {
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

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // captcha
    { method: 'get', path: 'captcha/image', controller: 'captcha' },
  ];
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {


module.exports = app => {
  const services = {
  };
  return services;
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

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