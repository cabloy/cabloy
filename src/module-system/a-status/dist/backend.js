/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 405:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Status extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'status');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async get(name) {
      const status = await ctx.db.get('aStatus', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      return status ? JSON.parse(status.value) : undefined;
    }

    async set(name, value) {
      await this._set({ name, value, queue: true });
    }

    async _set({ name, value, queue }) {
      const status = await ctx.db.get('aStatus', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      if (status) {
        await ctx.db.update('aStatus', {
          id: status.id,
          value: JSON.stringify(value),
        });
      } else {
        if (queue) {
          await ctx.meta.util.lock({
            resource: `${moduleInfo.relativeName}.statusSet.${this.moduleName}.${name}`,
            fn: async () => {
              return await ctx.meta.util.executeBeanIsolate({
                beanModule: moduleInfo.relativeName,
                fn: async ({ ctx }) => {
                  return await ctx.bean.status.module(this.moduleName)._set({ name, value, queue: false });
                },
              });
            },
          });
        } else {
          await ctx.db.insert('aStatus', {
            iid: ctx.instance.id,
            module: this.moduleName,
            name,
            value: JSON.stringify(value),
          });
        }
      }
    }
  }

  return Status;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aStatus
        const sql = `
          CREATE TABLE aStatus (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const beanStatus = __webpack_require__(405);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    status: {
      mode: 'ctx',
      bean: beanStatus,
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

/***/ 948:
/***/ ((module) => {

module.exports = app => {
  class StatusController extends app.Controller {}

  return StatusController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const status = __webpack_require__(948);

module.exports = app => {
  const controllers = {
    status,
  };
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
  };
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [];
  return routes;
};


/***/ }),

/***/ 257:
/***/ ((module) => {

module.exports = app => {
  class Status extends app.Service {}

  return Status;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const status = __webpack_require__(257);

module.exports = {
  status,
};


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