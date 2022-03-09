/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 115:
/***/ ((module) => {

let __sequences;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Sequence extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'sequence');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async reset(name) {
      const provider = this._findSequenceProvider(name);
      const sequence = await this._get(name);
      await ctx.db.update('aSequence', {
        id: sequence.id,
        value: JSON.stringify(provider.start),
      });
    }

    async current(name) {
      const sequence = await this._get(name);
      if (sequence) return JSON.parse(sequence.value);
      const provider = this._findSequenceProvider(name);
      return provider.start;
    }

    async next(name) {
      const moduleName = this.moduleName;
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.sequence.${moduleName}.${name}`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'sequence',
            fn: async ({ bean }) => {
              return await bean.module(moduleName)._nextLock(name);
            },
          });
        },
      });
    }

    async _nextLock(name) {
      const provider = this._findSequenceProvider(name);
      const sequence = await this._get(name);

      // current
      let current;
      if (sequence) {
        current = JSON.parse(sequence.value);
      } else {
        current = provider.start;
      }

      // next
      const value = await ctx.bean._getBean(provider.beanFullName).execute({ value: current });

      // save
      if (sequence) {
        await ctx.db.update('aSequence', {
          id: sequence.id,
          value: JSON.stringify(value),
        });
      } else {
        // insert
        await ctx.db.insert('aSequence', {
          iid: ctx.instance.id,
          module: this.moduleName,
          name,
          value: JSON.stringify(value),
        });
      }

      return value;
    }

    async _get(name) {
      // get
      const sequence = await ctx.db.get('aSequence', {
        iid: ctx.instance.id,
        module: this.moduleName,
        name,
      });
      return sequence;
    }

    _findSequenceProvider(name) {
      const fullKey = `${this.moduleName}:${name}`;
      if (!__sequences) {
        __sequences = this._collectSequences();
      }
      return __sequences[fullKey];
    }

    _collectSequences() {
      const sequences = {};
      for (const module of ctx.app.meta.modulesArray) {
        const providers = module.main.meta && module.main.meta.sequence && module.main.meta.sequence.providers;
        if (!providers) continue;
        for (const key in providers) {
          const provider = providers[key];
          const beanName = provider.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.sequence.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.sequence.${beanName.name}`;
          }
          const fullKey = `${module.info.relativeName}:${key}`;
          sequences[fullKey] = {
            ...provider,
            beanFullName,
          };
        }
      }
      return sequences;
    }
  }

  return Sequence;
};


/***/ }),

/***/ 80:
/***/ ((module) => {

module.exports = ctx => {
  class Sequence {
    async execute(context) {
      let value = context.value;
      return ++value;
    }
  }

  return Sequence;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aSequence
        const sql = `
          CREATE TABLE aSequence (
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
const sequenceSimple = __webpack_require__(80);
const beanSequence = __webpack_require__(115);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // sequence
    'sequence.simple': {
      mode: 'ctx',
      bean: sequenceSimple,
    },
    // global
    sequence: {
      mode: 'ctx',
      bean: beanSequence,
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

/***/ 110:
/***/ ((module) => {

module.exports = app => {
  class SequenceController extends app.Controller {}

  return SequenceController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const sequence = __webpack_require__(110);

module.exports = app => {
  const controllers = {
    sequence,
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

/***/ 543:
/***/ ((module) => {

module.exports = app => {
  class Sequence extends app.Service {}

  return Sequence;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const sequence = __webpack_require__(543);
module.exports = {
  sequence,
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