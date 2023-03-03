/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {}

    async init(options) {}

    async test() {}
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
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  DemoIsolateApp: 'Demo: Isolate App',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Unclassified: '未归类',
  DemoIsolateApp: '演示: 独立应用',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 323:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const info = {
    mine: {
      layout: true,
    },
  };
  const content = {
    presets: {
      anonymous: {},
      authenticated: {
        mobile: info,
        pc: info,
      },
    },
  };
  const _app = {
    atomName: 'General',
    atomStaticKey: 'appGeneral',
    atomRevision: 9,
    atomCategoryId: 'AppCategoryManagement',
    description: '',
    appIcon: '::radio-button-unchecked',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};


/***/ }),

/***/ 379:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {
        mobile: {
          menu: {
            layout: 'a-appbooster:layoutAppMenuSystem',
          },
        },
        pc: {
          menu: {
            layout: 'a-appbooster:layoutAppMenuSystem',
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'System',
    atomStaticKey: 'appSystem',
    atomRevision: 2,
    atomCategoryId: 'AppCategorySettings',
    description: '',
    appIcon: '::menu',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 0,
  };
  return _app;
};


/***/ }),

/***/ 571:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {},
    },
  };
  const _app = {
    atomName: 'Unclassified',
    atomStaticKey: 'appUnclassified',
    atomRevision: 1,
    atomCategoryId: 'AppCategoryManagement',
    description: '',
    appIcon: '::info-circle',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 1,
  };
  return _app;
};


/***/ }),

/***/ 241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const appGeneral = __webpack_require__(323);
const appSystem = __webpack_require__(379);
const appUnclassified = __webpack_require__(571);

module.exports = app => {
  const apps = [
    //
    appGeneral(app),
    appSystem(app),
    appUnclassified(app),
  ];
  return apps;
};


/***/ }),

/***/ 303:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      list: {
        blocks: {
          items: {
            component: {
              module: moduleInfo.relativeName,
              name: 'appSystemMenuLayoutBlockListItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'System',
    atomStaticKey: 'layoutAppMenuSystem',
    atomRevision: 2,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutAppMenuSystem = __webpack_require__(303);

module.exports = app => {
  const layouts = [layoutAppMenuSystem(app)];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const resources = [];
  return resources;
};


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

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {
  // aops
  const aops = __webpack_require__(224)(app);
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
    aops,
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
  // schemas
  const schemas = __webpack_require__(232)(app);
  // static
  const staticApps = __webpack_require__(241)(app);
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-app.app': {
          items: staticApps,
        },
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    index: {
      indexes: {},
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