/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const chalk = require3('chalk');

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      // check indexes
      if (this.ctx.config.indexesCheck) {
        // combine module's indexes
        const moduleIndexes = {};
        for (const relativeName in this.app.meta.modules) {
          const module = this.app.meta.modules[relativeName];
          if (module.main.meta && module.main.meta.index && module.main.meta.index.indexes) {
            moduleIndexes[relativeName] = module.main.meta.index.indexes;
          }
        }
        // combine indexes all
        const indexes = this.ctx.bean.util.extend(
          {},
          this.ctx.config.indexes,
          moduleIndexes,
          this.ctx.config.indexesExtend
        );
        // create indexes
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

    async init(options) {}

    async test() {}

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
            // too long
            // const sql = `create ${indexType} index idx_${tableName}_${fieldNameArray.join('_')} ON ${tableName} (${fieldNameArray.join(',')})`;
            const sql = `create ${indexType} index idx_${tableName}_${fieldNameFirst} ON ${tableName} (${fieldNameArray.join(
              ','
            )})`;
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
      aAtom:
        'createdAt,updatedAt,itemId,atomStage,atomFlowId,atomClassId,atomName,userIdCreated,userIdUpdated,atomStaticKey,atomLanguage,atomCategoryId',
      aAtomAction: 'createdAt,updatedAt,atomClassId+code,name',
      aAtomClass: 'createdAt,updatedAt,module+atomClassName',
      aAtomLabel: 'createdAt,updatedAt,userId,atomId',
      aAtomLabelRef: 'createdAt,updatedAt,userId+labelId,atomId',
      aAtomStar: 'createdAt,updatedAt,userId,atomId',
      aAuth: 'createdAt,updatedAt,userId,providerId+profileId',
      aAuthProvider: 'createdAt,updatedAt,module+providerName',
      aCategory: 'createdAt,updatedAt,atomClassId,categoryName,categorySorting,categoryIdParent',
      aComment: 'createdAt,updatedAt,atomId,userId,sorting',
      aCommentHeart: 'createdAt,updatedAt,userId,atomId,commentId',
      aLabel: 'createdAt,updatedAt,userId',
      aResource: 'createdAt,updatedAt,atomId,resourceSorting,resourceType',
      aResourceLocale: 'createdAt,updatedAt,atomId,locale',
      aResourceRole: 'createdAt,updatedAt,atomId,roleId',
      aRole: 'createdAt,updatedAt,roleName,sorting,roleIdParent',
      aRoleExpand: 'createdAt,updatedAt,roleId,roleIdBase',
      aRoleInc: 'createdAt,updatedAt,roleId,roleIdInc',
      aRoleIncRef: 'createdAt,updatedAt,roleId,roleIdInc,roleIdSrc',
      aRoleRef: 'createdAt,updatedAt,roleId,roleIdParent',
      aRoleRight: 'createdAt,updatedAt,roleId,atomClassId+action',
      aRoleRightRef: 'createdAt,updatedAt,roleRightId,roleId,atomClassId+action,roleIdScope',
      aTag: 'createdAt,updatedAt,atomClassId,tagName',
      aTagRef: 'createdAt,updatedAt,atomId,tagId',
      aUser: 'createdAt,updatedAt,userName,email,mobile',
      aUserAgent: 'createdAt,updatedAt,userId,userIdAgent',
      aUserRole: 'createdAt,updatedAt,userId,roleId',
    },
    'a-cache': {
      aCache: 'createdAt,updatedAt,module+name',
    },
    'a-cms': {
      aCmsArticle: 'createdAt,updatedAt,atomId,sticky,slug,sorting',
      aCmsContent: 'createdAt,updatedAt,atomId,html:fulltext',
    },
    'a-dashboard': {
      aDashboard: 'createdAt,updatedAt,atomId',
      aDashboardContent: 'createdAt,updatedAt,atomId,itemId',
      aDashboardUser: 'createdAt,updatedAt,userId,dashboardAtomId',
    },
    'a-detail': {
      aDetail: 'createdAt,updatedAt,atomId,detailItemId,detailClassId,detailStaticKey',
      aDetailClass: 'createdAt,updatedAt,module+detailClassName',
    },
    'a-dict': {
      aDict: 'createdAt,updatedAt,atomId',
    },
    'a-dingtalk': {
      aDingtalkDepartment: 'createdAt,updatedAt,roleId,departmentId,departmentParentId',
      aDingtalkMember: 'createdAt,updatedAt,userId,memberId',
    },
    'a-file': {
      aFile: 'createdAt,updatedAt,userId,downloadId,atomId',
    },
    'a-flow': {
      aFlow: 'createdAt,updatedAt,flowDefId,flowStatus,flowUserId',
      aFlowDef: 'createdAt,updatedAt,atomId',
      aFlowDefContent: 'createdAt,updatedAt,atomId,itemId',
      aFlowHistory: 'createdAt,updatedAt,flowId,flowDefId,flowStatus,flowUserId',
      aFlowNode: 'createdAt,updatedAt,flowId,flowNodeIdPrev',
      aFlowNodeHistory: 'createdAt,updatedAt,flowId,flowNodeId,flowNodeIdPrev',
    },
    'a-flowtask': {
      aFlowNodeStartEventAtomCondition: 'createdAt,updatedAt,flowDefId,atomClassId',
      aFlowTask: 'createdAt,updatedAt,flowId,flowNodeId,flowTaskStatus,userIdAssignee',
      aFlowTaskHistory: 'createdAt,updatedAt,flowId,flowTaskId,flowNodeId,flowTaskStatus,userIdAssignee',
    },
    'a-instance': {
      aInstance: 'createdAt,updatedAt,name',
    },
    'a-mail': {
      aMail: 'createdAt,updatedAt,status',
    },
    'a-progress': {},
    'a-sequence': {
      aSequence: 'createdAt,updatedAt,module+name',
    },
    'a-settings': {
      aSettings: 'createdAt,updatedAt,module+scene+userId',
      aSettingsRef: 'createdAt,updatedAt,module+scene+userId+name',
    },
    'a-share': {
      aShare: 'createdAt,updatedAt,uuid,atomId,userId,host',
      aShareRecordPV: 'createdAt,updatedAt,shareId,userId',
      aShareRecordUV: 'createdAt,updatedAt,atomId,userIdSource,userIdTarget',
    },
    'a-socketio': {
      aSocketIOMessage: 'createdAt,updatedAt,messageClassId,messageFilter,sessionId',
      aSocketIOMessageClass: 'createdAt,updatedAt,module+messageClassName',
      aSocketIOMessageSync: 'createdAt,updatedAt,messageId,userId,messageRead',
    },
    'a-stats': {
      aStats: 'createdAt,updatedAt,userId,module+name',
    },
    'a-status': {
      aStatus: 'createdAt,updatedAt,module+name',
    },
    'a-wechat': {
      aWechatUser: 'createdAt,updatedAt,userId,openid,unionid',
    },
    'a-wxwork': {
      aWxworkDepartment: 'createdAt,updatedAt,roleId,departmentId,departmentParentId',
      aWxworkMember: 'createdAt,updatedAt,userId,memberId',
    },
  };
  // indexes extend
  config.indexesExtend = null;
  // indexesCheck
  config.indexesCheck = true;

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