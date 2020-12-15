module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module) => {

module.exports = app => {

  class Version extends app.meta.BeanBase {

    // eslint-disable-next-line
    async update(options) {
    }

    async init(options) {

      if (options.version === 1) {}

      if (options.version === 2) {}

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

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Copyright: '版权',
  Clock: '时钟',
  Dashboard: '仪表板',
  Mine: '我的',
  Fullscreen: '全屏',
  Button: '按钮',
  Buttons: '按钮',
  Panel: '面板',
  Panels: '面板',
  'Sidebar Button': '边栏按钮',
  'Sidebar Panel': '边栏面板',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // panels
    {
      atomName: 'Menu',
      atomStaticKey: 'panelMenu',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:panel.General',
      resourceType: 'a-layoutpc:panel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/resource/tree',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Atom',
      atomStaticKey: 'panelAtom',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:panel.General',
      resourceType: 'a-layoutpc:panel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/atom/list',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Search',
      atomStaticKey: 'panelSearch',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:panel.General',
      resourceType: 'a-layoutpc:panel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/atom/searchQuick',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'panelMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:panel.General',
      resourceType: 'a-layoutpc:panel',
      resourceConfig: JSON.stringify({
        url: '/a/user/user/mine',
      }),
      resourceRoles: 'root',
    },
    // buttons
    {
      atomName: 'Home',
      atomStaticKey: 'buttonHome',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { material: 'home' },
        actionPath: '/a/dashboard/dashboard?key=home',
        scene: 'dashboard',
        sceneOptions: { name: 'home' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Dashboard',
      atomStaticKey: 'buttonDashboard',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { material: 'dashboard' },
        actionPath: '/a/dashboard/dashboard',
        scene: 'dashboard',
        sceneOptions: { name: 'dashboard' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Fullscreen',
      atomStaticKey: 'buttonFullscreen',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonFullscreen',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonMine',
        icon: { material: 'person' },
        actionPath: null,
        scene: 'sidebar', sceneOptions: { side: 'right', module: 'a-layoutpc', name: 'panelMine' },
        showSeparator: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Clock',
      atomStaticKey: 'buttonClock',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonClock',
        actionPath: '/a/layoutpc/button/clock/preferences',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'preferences', title: 'Preferences' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Copyright',
      atomStaticKey: 'buttonCopyright',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: null,
        actionPath: '/a/basefront/base/about',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'about', title: 'About' },
        showLabel: true,
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
  const controllers = {
  };
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

  // beans
  const beans = __webpack_require__(187)(app);
  // meta
  const meta = __webpack_require__(458)(app);
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      resources: {
        button: {
          title: 'Sidebar Button',
        },
        panel: {
          title: 'Sidebar Panel',
        },
      },
      statics: {
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

module.exports = [
];


/***/ }),

/***/ 214:
/***/ ((module) => {


module.exports = {
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
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map