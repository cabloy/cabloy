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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(4);
const middlewares = __webpack_require__(5);

module.exports = app => {

  // routes
  const routes = __webpack_require__(6)(app);
  // services
  const services = __webpack_require__(8)(app);
  // models
  const models = __webpack_require__(11)(app);
  // meta
  const meta = __webpack_require__(12)(app);

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
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
  };

  // indexes
  config.indexes = {
    'a-version': {
      aVersion: 'createdAt,updatedAt,module,version',
      aVersionInit: 'createdAt,updatedAt,subdomain+module,version',
    },
    'a-authsimple': {
      aAuthSimple: 'createdAt,updatedAt,userId',
    },
    'a-base': {
      aAtom: 'createdAt,updatedAt,itemId,atomFlag,atomName,userIdCreated',
      aAtomAction: 'createdAt,updatedAt,atomClassId+code,name',
      aAtomClass: 'createdAt,updatedAt,module+atomClassName',
      aAtomLabel: 'createdAt,updatedAt,userId,atomId',
      aAtomLabelRef: 'createdAt,updatedAt,userId+labelId,atomId',
      aAtomStar: 'createdAt,updatedAt,userId,atomId',
      aAuth: 'createdAt,updatedAt,userId,providerId+profileId',
      aAuthProvider: 'createdAt,updatedAt,module+providerName',
      aComment: 'createdAt,updatedAt,atomId,userId,sorting',
      aCommentHeart: 'createdAt,updatedAt,userId,atomId,commentId',
      aFunction: 'createdAt,updatedAt,module+name,scene,atomClassId+action,sorting',
      aFunctionLocale: 'createdAt,updatedAt,functionId',
      aFunctionStar: 'createdAt,updatedAt,userId,functionId',
      aLabel: 'createdAt,updatedAt,userId',
      aRole: 'createdAt,updatedAt,roleName,sorting,roleIdParent',
      aRoleExpand: 'createdAt,updatedAt,roleId,roleIdBase',
      aRoleFunction: 'createdAt,updatedAt,roleId,functionId,roleRightId',
      aRoleInc: 'createdAt,updatedAt,roleId,roleIdInc',
      aRoleIncRef: 'createdAt,updatedAt,roleId,roleIdInc,roleIdSrc',
      aRoleRef: 'createdAt,updatedAt,roleId,roleIdParent',
      aRoleRight: 'createdAt,updatedAt,roleId,atomClassId+action',
      aRoleRightRef: 'createdAt,updatedAt,roleRightId,roleId,atomClassId+action,roleIdScope',
      aUser: 'createdAt,updatedAt,userName,email,mobile',
      aUserAgent: 'createdAt,updatedAt,userId,userIdAgent',
      aUserRole: 'createdAt,updatedAt,userId,roleId',
    },
    'a-cache': {
      aCache: 'createdAt,updatedAt,module+name',
    },
    'a-cms': {
      aCmsArticle: 'createdAt,updatedAt,atomId,categoryId,sticky,sorting',
      aCmsArticleTag: 'createdAt,updatedAt,atomId,itemId',
      aCmsArticleTagRef: 'createdAt,updatedAt,atomId,itemId,tagId',
      aCmsCategory: 'createdAt,updatedAt,categoryName,sorting,categoryIdParent',
      aCmsContent: 'createdAt,updatedAt,atomId,itemId,content:fulltext',
      aCmsTag: 'createdAt,updatedAt,language+tagName',
    },
    'a-file': {
      aFile: 'createdAt,updatedAt,userId,downloadId,atomId',
    },
    'a-instance': {
      aInstance: 'createdAt,updatedAt,name',
    },
    'a-sequence': {
      aSequence: 'createdAt,updatedAt,module+name',
    },
    'a-settings': {
      aSettings: 'createdAt,updatedAt,module+scene+userId',
      aSettingsRef: 'createdAt,updatedAt,module+scene+userId+name',
    },
    'a-status': {
      aStatus: 'createdAt,updatedAt,module+name',
    },

  };
  // indexes extend
  config.indexesExtend = null;
  // indexesCheck
  config.indexesCheck = true;

  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(3),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(7);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  ];
  return routes;
};


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(9);

module.exports = app => {
  const services = {
    version,
  };
  return services;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(10);
const extend = require3('extend2');
const chalk = require3('chalk');

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      // check indexes
      if (this.ctx.config.indexesCheck) {
        const indexes = extend(true, {}, this.ctx.config.indexes, this.ctx.config.indexesExtend);
        for (const moduleRelativeName in indexes) {
          if (this.app.meta.modules[moduleRelativeName]) {
            const moduleIndexes = indexes[moduleRelativeName];
            for (const tableName in moduleIndexes) {
              await this._createIndexesOnTable({ tableName, indexes: moduleIndexes[tableName] });
            }
          }
        }
      }
    }

    async init(options) {
    }

    async test() {
    }

    async _createIndexesOnTable({ tableName, indexes }) {
      try {
        const _indexArray = indexes.split(',');
        const list = await this.ctx.model.query(`show index from ${tableName}`);
        const map = {};
        for (const item of list) {
          map[item.Column_name] = item.Index_type;
        }
        for (const _index of _indexArray) {
          const _arr = _index.split(':');
          const fieldNames = _arr[0];
          const fieldNameArray = fieldNames.split('+');
          const fieldNameFirst = fieldNameArray[0];
          const indexType = _arr[1] || '';
          if (!map[fieldNameFirst]) {
            const sql = `create ${indexType} index idx_${tableName}_${fieldNameArray.join('_')} ON ${tableName} (${fieldNameArray.join(',')})`;
            await this.ctx.model.query(sql);
          }
        }
      } catch (e) {
        // just log the error message
        console.log(chalk.red(e.message));
        if (e.sql) console.log(chalk.red(e.sql));
      }
    }

  }

  return Version;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(13)(app);
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
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map