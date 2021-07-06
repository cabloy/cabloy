/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 839:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  const __adapter = (context, chain) => {
    const eventBean = ctx.bean._getBean(chain);
    if (!eventBean) throw new Error(`event not found: ${chain}`);
    if (!eventBean.execute) throw new Error(`event.execute not found: ${chain}`);
    return {
      receiver: eventBean,
      fn: eventBean.execute,
    };
  };

  class Event extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'event');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async invoke({ module, name, data, result, next }) {
      const eventArray = this._getEventArray({ module, name });
      // context
      const context = {
        data,
        result,
      };
      // invoke
      await ctx.app.meta.util.composeAsync(eventArray, __adapter)(context, async (context, _next) => {
        if (next) {
          await next(context, _next);
        } else {
          await _next();
        }
      });
      // ok
      return context.result;
    }

    _getEventArray({ module, name }) {
      module = module || this.moduleName;
      const key = `${module}:${name}`;
      const events = ctx.bean.util.getPropertyObject(ctx.app.meta, 'events');
      if (events[key]) return events[key];
      events[key] = this._collectEventArray(key);
      return events[key];
    }

    _collectEventArray(key) {
      const eventArray = [];
      for (const module of ctx.app.meta.modulesArray) {
        const implementations = module.main.meta && module.main.meta.event && module.main.meta.event.implementations;
        if (!implementations) continue;
        // bean
        const implementationName = implementations[key];
        if (!implementationName) continue;
        let beanFullName;
        if (typeof implementationName === 'string') {
          beanFullName = `${module.info.relativeName}.event.${implementationName}`;
        } else {
          beanFullName = `${implementationName.module || module.info.relativeName}.event.${implementationName.name}`;
        }
        eventArray.push(beanFullName);
      }
      return eventArray;
    }
  }

  return Event;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const beanEvent = __webpack_require__(839);

module.exports = app => {
  const beans = {
    // global
    event: {
      mode: 'ctx',
      bean: beanEvent,
      global: true,
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

  // middlewares
  config.middlewares = {};

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

/***/ 95:
/***/ ((module) => {

module.exports = app => {
  const controllers = {};
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const services = __webpack_require__(214);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // meta
  const meta = __webpack_require__(458)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module) => {

module.exports = app => {
  const meta = {};
  return meta;
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

module.exports = {};


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