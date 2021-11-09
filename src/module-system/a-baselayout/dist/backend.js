/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ 444:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // filterTabBasic
  schemas.filterTabBasic = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        ebSearch: {
          // fieldName: 'atomName',
          // tableAlias: 'a',
          // ignoreValue:0,
          operators: 'like,likeLeft,likeRight,=', // {} } { =
          combine: {
            actionModule: 'a-components',
            actionComponent: 'combineSearch',
            name: 'atomName',
          },
        },
      },
      stage: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Stage',
        ebParams: { openIn: 'sheet', closeOnSelect: true },
        ebDisplay: {
          expression: '_meta.host.stages.length>1',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
      __divider: {
        ebType: 'divider',
      },
      atomClass: {
        type: 'object',
        ebType: 'atomClass',
        ebTitle: 'Atom Class',
        ebParams: {
          optional: true,
        },
        ebDisplay: {
          expression: '!_meta.host.container.atomClass',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 384:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // filterTabGeneral
  schemas.filterTabGeneral = {
    type: 'object',
    properties: {
      mine: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Mine',
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      star: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'UserStar',
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      label: {
        type: 'number',
        ebType: 'userLabel',
        ebTitle: 'UserLabel',
        ebParams: {
          optional: true,
        },
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      createdAt: {
        type: 'string',
        ebType: 'dateRange',
        ebTitle: 'Created Date',
        ebParams: {
          dateFormat: 'YYYY-MM-DD',
          header: false,
          toolbar: true,
        },
        ebSearch: {
          tableAlias: 'a',
          combine: {
            actionModule: 'a-components',
            actionComponent: 'combineSearch',
            name: 'dateRange',
          },
        },
      },
      language: {
        type: 'string',
        ebType: 'language',
        ebTitle: 'Language',
        ebOptionsBlankAuto: true,
        ebParams: { openIn: 'sheet', closeOnSelect: true },
        ebDisplay: {
          expression: '_meta.host.atomClassBase && _meta.host.atomClassBase.language',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const filterTabBasic = __webpack_require__(444);
const filterTabGeneral = __webpack_require__(384);

module.exports = app => {
  const schemas = {};
  // filterTabBasic
  Object.assign(schemas, filterTabBasic(app));
  // filterTabGeneral
  Object.assign(schemas, filterTabGeneral(app));
  // ok
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
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
module.exports = app => {
  // controllers
  const controllers = __webpack_require__(95)(app);
  // meta
  const meta = __webpack_require__(458)(app);
  return {
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  // schemas
  const schemas = __webpack_require__(232)(app);
  // meta
  const meta = {
    validation: {
      validators: {},
      keywords: {},
      schemas: {
        filterTabBasic: schemas.filterTabBasic,
        filterTabGeneral: schemas.filterTabGeneral,
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = [];


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