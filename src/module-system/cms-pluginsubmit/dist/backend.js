/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const url = __webpack_require__(310);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class LocalTools {
    async submit({ links, config }) {
      for (const target in config.submit) {
        const targetConfig = config.submit[target];
        await this._submit({ target, targetConfig, links });
      }
    }

    async _submit({ target, targetConfig, links }) {
      if (!targetConfig.token) return;
      if (!links || links.length === 0) return;
      // host
      const parts = url.parse(links[0]);
      const hostname = parts.hostname;
      if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.indexOf('192.168') === 0) {
        return;
      }
      // queue
      ctx.tail(() => {
        ctx.meta.util.queuePush({
          module: moduleInfo.relativeName,
          queueName: 'submit',
          data: {
            target,
            targetConfig,
            hostname,
            links,
          },
        });
      });
    }
  }
  return LocalTools;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const { target, targetConfig, hostname, links } = context.data;
      if (target === 'baidu') {
        await this._queueSubmitBaidu({ target, targetConfig, hostname, links });
      }
    }

    async _queueSubmitBaidu({ targetConfig, hostname, links }) {
      // submit
      const url = `http://data.zz.baidu.com/urls?site=${hostname}&token=${targetConfig.token}`;
      const options = {
        method: 'POST',
        contentType: 'text/plain',
        dataType: 'json',
        data: links.join('\n'),
      };
      const res = await this.ctx.curl(url, options);
      if (res.status !== 200) {
        // log
        this.ctx.logger.error(new Error(res.data && res.data.message));
      } else {
        // log
        this.ctx.logger.info(`submit baidu: ${links.join('\n')}`);
      }
    }
  }

  return Queue;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const queueSubmit = __webpack_require__(232);
const localTools = __webpack_require__(887);

module.exports = app => {
  const beans = {
    // queue
    'queue.submit': {
      mode: 'app',
      bean: queueSubmit,
    },
    // local
    'local.tools': {
      mode: 'ctx',
      bean: localTools,
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

  // plugin
  config.plugin = {
    submit: {
      baidu: {
        token: '',
      },
    },
  };

  // queues
  config.queues = {
    submit: {
      bean: 'submit',
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

module.exports = {};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 746:
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
  const schemas = __webpack_require__(746)(app);
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
  const routes = [];
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = app => {
  const services = {};
  return services;
};


/***/ }),

/***/ 310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

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