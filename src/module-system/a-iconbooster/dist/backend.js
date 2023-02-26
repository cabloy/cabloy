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

/***/ 487:
/***/ ((module) => {

module.exports = {
  auth: 'dingtalk-square,github,password,sms,wechat-outline,wxwork-outline',
  business: 'coupon,course,distribution,hotsprings,kitchen-set,money-bag,party,provider,purchase,store',
  default: 'add,alert,archive,arrow-back,arrow-cycle,arrow-down-left,arrow-down-right,arrow-down,arrow-drop-down,arrow-drop-up,arrow-forward,arrow-left,arrow-repeat,arrow-right-left,arrow-right,arrow-shuffle,arrow-up-down,arrow-up-left,arrow-up-right,arrow-up,article,attachment-line,book,cabloy,checkbox-checked,checkbox-intermediate,checkbox-off,checkbox,chevron-left,chevron-right,close,comment-dots,construction,copyright,cross-circle,dashboard,database,delete-forever,delete,developer-board,done,dot,draft,drive-file-move,edit,expand-more,export,fast-forward,flow-chart,folder-open,folder,fullscreen-exit,fullscreen,grading,group-work,group,groups,heart,home,identification,import,info-circle,information-filled,information,label,language,layers,layout-columns,location-on,lock-open,lock,mail,mark-as-unread,mark-email-read,menu,message,module,more-horiz,notebook,open-in-new,open-with,people,person,play-arrow,popup,preview,radio-button-checked,radio-button-unchecked,redo,remove,reply,round-person-add,save,search,send,settings,share,sort,star,stats-chart,stop,undo,view-list,visibility,zoom-in,zoom-out',
  editor: 'add-box-outline,add-box,bookmark-outline,bookmark,code-block,code,format-align-center,format-align-left,format-align-right,format-bold,format-italic,format-list-bulleted,format-list-numbered,format-quote,format-strikethrough,format-underlined,grid-on,horizontal-rule,image-outline,image,insert-link-outline,paragraph-break,paragraph,redo,source-outline,subscript,superscript,task-alt,title,undo',
  flow: 'activity-none,activity-service,activity-user-task,end-event-atom,end-event-none,gateway-exclusive,gateway-inclusive,gateway-parallel,start-event-atom,start-event-none,start-event-timer',
  login: 'call-outline,chevron-left,done,lock-outline,person-outline',
  outline: 'add-circle-outline,alert-outline,apps-outline,archive-lock-outline,archive-outline,article-outline,backspace-outline,build-circle-outline,calendar-today-outline,check-circle-outline,checkbox-checked-outline,checkbox-off-outline,checkbox-outline,copy-outline,data-list-outline,database-lock-outline,delete-forever-outline,delete-outline,dict-outline,draft-outline,folder-transfer-outline,group-outline,heart-outline,insert-emoticon-outline,key-reset-outline,label-outline,layout-outline,login-outline,logout-outline,mail-outline,note-outline,software-resource-cluster-outline,software-resource-outline,star-outline,theme-outline,timer-outline,visibility-off-outline,visibility-outline,work-history-outline',
  role: 'level,organization,position,relation,role,shield-key,template',
  social: 'facebook,framework7,twitter',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Icons Booster': '图标增强包',
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
  const schemas = __webpack_require__(232)(app);
  const iconGroups = __webpack_require__(487);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    icon: {
      groups: iconGroups,
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