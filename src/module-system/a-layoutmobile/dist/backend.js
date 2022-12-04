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

/***/ 327:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Tabbar Button': '选项卡按钮',
  'Mobile Layout': 'Mobile布局',
  'Mobile Layout(Authenticated)': 'Mobile布局（认证用户）',
  'Mobile Layout(Anonymous)': 'Mobile布局（匿名用户）',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 215:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    toolbar: {
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonAppMenu' },
        { module: 'a-layoutmobile', name: 'buttonAppHome' },
        { module: 'a-layoutmobile', name: 'buttonAppMine' },
      ],
    },
  };
  const layout = {
    atomName: 'Mobile Layout(Authenticated)',
    atomStaticKey: 'layoutMobile',
    atomRevision: 8,
    description: '',
    layoutTypeCode: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 912:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    toolbar: {
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonAppMenu' },
        { module: 'a-layoutmobile', name: 'buttonAppHome' },
        { module: 'a-layoutmobile', name: 'buttonAppMine' },
      ],
    },
  };
  const layout = {
    atomName: 'Mobile Layout(Anonymous)',
    atomStaticKey: 'layoutMobileAnonymous',
    atomRevision: 7,
    description: '',
    layoutTypeCode: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutMobile = __webpack_require__(215);
const layoutMobileAnonymous = __webpack_require__(912);

module.exports = app => {
  const layouts = [layoutMobile(app), layoutMobileAnonymous(app)];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // tabbar buttons
    {
      atomName: 'WorkplaceTitle',
      atomStaticKey: 'buttonAppMenu',
      atomRevision: 1,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppMenu',
        icon: { f7: ':outline:apps-outline' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Home',
      atomStaticKey: 'buttonAppHome',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppHome',
        icon: { f7: '::home' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonAppMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppMine',
        icon: { f7: '::person' },
        url: '/a/user/user/mine',
        fixed: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Atom',
      atomStaticKey: 'buttonAtom',
      atomRevision: 2,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::database' },
        url: '/a/basefront/atom/list',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Search',
      atomStaticKey: 'buttonSearch',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::search' },
        url: '/a/basefront/atom/searchQuick',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonMine',
      atomRevision: -1,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonMine',
        icon: { f7: '::person' },
        url: '/a/user/user/mine',
        fixed: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Home',
      atomStaticKey: 'buttonHome',
      atomRevision: -1,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::home' },
        url: '/a/basefront/resource/tree',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
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
  // meta
  const meta = __webpack_require__(458)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
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
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      resources: {
        button: {
          title: 'Tabbar Button',
        },
      },
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
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