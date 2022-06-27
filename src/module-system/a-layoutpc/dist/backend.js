/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 3) {
        // ref: a-baselayout
      }
    }

    async init(options) {
      if (options.version === 3) {
        // ref: a-baselayout
      }
      if (options.version === 4) {
        // ref: a-baselayout
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
  ViewLayout: 'View',
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
  ViewLayout: '视图',
  Appearance: '外观',
  Theme: '主题',
  'Sidebar Button': '边栏按钮',
  'Sidebar Panel': '边栏面板',
  'PC Layout': 'PC布局',
  'PC Layout(Authenticated)': 'PC布局（认证用户）',
  'PC Layout(Anonymous)': 'PC布局（匿名用户）',
  'App Home': '应用首页',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 456:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    sidebar: {
      top: {
        buttons: [
          { module: 'a-layoutpc', name: 'buttonAppHome' },
          { module: 'a-layoutpc', name: 'buttonSearch' },
          { module: 'a-layoutpc', name: 'buttonFullscreen' },
          { module: 'a-layoutpc', name: 'buttonAppMine' },
        ],
      },
      left: {
        panels: [],
      },
      right: {
        panels: [],
      },
      bottom: {
        panels: [],
        buttons: [
          { module: 'a-layoutpc', name: 'buttonViewLayout' },
          { module: 'a-layoutpc', name: 'buttonTheme' },
          { module: 'a-layoutpc', name: 'buttonClock' },
        ],
      },
    },
  };
  const layout = {
    atomName: 'PC Layout(Authenticated)',
    atomStaticKey: 'layoutPC',
    atomRevision: 10,
    description: '',
    layoutTypeCode: 2,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 674:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    sidebar: {
      top: {
        buttons: [
          { module: 'a-layoutpc', name: 'buttonAppHome' },
          { module: 'a-layoutpc', name: 'buttonSearch' },
          { module: 'a-layoutpc', name: 'buttonFullscreen' },
          { module: 'a-layoutpc', name: 'buttonAppMine' },
        ],
      },
      left: {
        panels: [],
      },
      right: {
        panels: [],
      },
      bottom: {
        panels: [],
        buttons: [{ module: 'a-layoutpc', name: 'buttonClock' }],
      },
    },
  };
  const layout = {
    atomName: 'PC Layout(Anonymous)',
    atomStaticKey: 'layoutPCAnonymous',
    atomRevision: 10,
    description: '',
    layoutTypeCode: 2,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutPC = __webpack_require__(456);
const layoutPCAnonymous = __webpack_require__(674);

module.exports = app => {
  const layouts = [layoutPC(app), layoutPCAnonymous(app)];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Layout',
      atomStaticKey: 'createLayout',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'layout',
        atomAction: 'create',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Layout List',
      atomStaticKey: 'listLayout',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'layout',
        atomAction: 'read',
      }),
      resourceRoles: 'template.system',
    },
    // panels
    {
      atomName: 'Menu',
      atomStaticKey: 'panelMenu',
      atomRevision: -1,
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
      atomRevision: 10,
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
      atomRevision: -1,
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
      atomRevision: -1,
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
      atomStaticKey: 'buttonAppHome',
      atomRevision: 4,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
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
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonAppMine',
        icon: { f7: '::person' },
        showSeparator: true,
        fixed: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Search',
      atomStaticKey: 'buttonSearch',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::search' },
        actionPath: '/a/basefront/atom/searchQuick',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'search', title: 'Search' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Home',
      atomStaticKey: 'buttonHome',
      atomRevision: -1,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::home' },
        actionPath: '/a/dashboard/dashboard?key=home',
        scene: 'dashboard',
        sceneOptions: { name: 'home' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Dashboard',
      atomStaticKey: 'buttonDashboard',
      atomRevision: -1,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::dashboard' },
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
      atomRevision: -1,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonMine',
        icon: { f7: '::person' },
        actionPath: null,
        scene: 'sidebar',
        sceneOptions: { side: 'right', module: 'a-layoutpc', name: 'panelMine' },
        showSeparator: true,
        fixed: true,
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
      atomRevision: -1,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: '::copyright' },
        actionPath: '/a/basefront/base/about',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'about', title: 'About' },
        showLabel: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'ViewLayout',
      atomStaticKey: 'buttonViewLayout',
      atomRevision: 2,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: ':outline:layout-outline' },
        actionPath: '/a/user/view/pc',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'viewLayout', title: 'ViewLayout' },
        showLabel: false,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Theme',
      atomStaticKey: 'buttonTheme',
      atomRevision: 2,
      atomCategoryId: 'a-layoutpc:button.General',
      resourceType: 'a-layoutpc:button',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { f7: ':outline:theme-outline' },
        actionPath: '/a/user/Theme',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'theme', title: 'Theme' },
        showLabel: false,
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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

const routes = __webpack_require__(825);
const services = __webpack_require__(214);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
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
  const staticLayouts = __webpack_require__(512)(app);
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