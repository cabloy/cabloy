/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add layout
      const res = await this.ctx.model.layout.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      const content = {
        login: '/a/login/login',
        loginOnStart: true,
      };
      await this.ctx.model.layoutContent.insert({
        atomId: key.atomId,
        itemId,
        content: JSON.stringify(content),
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update layout
      const data = await this.ctx.model.layout.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.layout.update(data);
      // update content
      await this.ctx.model.layoutContent.update(
        {
          content: item.content,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
    }

    async delete({ atomClass, key, user }) {
      // super
      await super.delete({ atomClass, key, user });
      // delete layout
      await this.ctx.model.layout.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.layoutContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 3) {
        // create table: aLayout
        let sql = `
          CREATE TABLE aLayout (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
          `;
        await this.ctx.model.query(sql);

        // create table: aLayoutContent
        sql = `
          CREATE TABLE aLayoutContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aLayoutViewFull
        sql = `
          CREATE VIEW aLayoutViewFull as
            select a.*,b.content from aLayout a
              left join aLayoutContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 3) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'superuser' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'write', scopeNames: 'superuser' },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
          { roleName: 'system', action: 'clone', scopeNames: 0 },
          { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
          { roleName: 'system', action: 'authorize', scopeNames: 0 },
          { roleName: 'system', action: 'authorize', scopeNames: 'superuser' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'layout', roleRights });
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomLayout = __webpack_require__(224);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.layout': {
      mode: 'app',
      bean: atomLayout,
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
  Layout: '布局',
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
  'Create Layout': '新建布局',
  'Layout List': '布局列表',
  'PC Layout': 'PC布局',
  'PC Layout(Authenticated)': 'PC布局（认证用户）',
  'PC Layout(Anonymous)': 'PC布局（匿名用户）',
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
          { module: 'a-layoutpc', name: 'buttonHome' },
          { module: 'a-layoutpc', name: 'buttonDashboard' },
          { module: 'a-layoutpc', name: 'buttonFullscreen' },
          { module: 'a-layoutpc', name: 'buttonMine' },
        ],
      },
      left: {
        panels: [
          { module: 'a-layoutpc', name: 'panelMenu' },
          { module: 'a-layoutpc', name: 'panelAtom' },
          { module: 'a-layoutpc', name: 'panelSearch' },
        ],
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
          { module: 'a-layoutpc', name: 'buttonCopyright' },
        ],
      },
    },
  };
  const layout = {
    atomName: 'PC Layout(Authenticated)',
    atomStaticKey: 'layoutPC',
    atomRevision: 3,
    description: '',
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
          { module: 'a-layoutpc', name: 'buttonHome' },
          { module: 'a-layoutpc', name: 'buttonFullscreen' },
          { module: 'a-layoutpc', name: 'buttonMine' },
        ],
      },
      left: {
        panels: [
          { module: 'a-layoutpc', name: 'panelMenu' },
          { module: 'a-layoutpc', name: 'panelAtom' },
          { module: 'a-layoutpc', name: 'panelSearch' },
        ],
      },
      right: {
        panels: [],
      },
      bottom: {
        panels: [],
        buttons: [
          { module: 'a-layoutpc', name: 'buttonClock' },
          { module: 'a-layoutpc', name: 'buttonCopyright' },
        ],
      },
    },
  };
  const layout = {
    atomName: 'PC Layout(Anonymous)',
    atomStaticKey: 'layoutPCAnonymous',
    atomRevision: 1,
    description: '',
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
      atomRevision: 0,
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
      atomRevision: 0,
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
      atomRevision: 1,
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
      atomRevision: 1,
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
      atomRevision: 1,
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
      atomRevision: 0,
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
      atomRevision: 1,
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
  // layout
  schemas.layout = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
        ebReadOnly: true,
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      content: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Content',
        notEmpty: true,
      },
    },
  };
  // layout search
  schemas.layoutSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
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
      atoms: {
        layout: {
          info: {
            bean: 'layout',
            title: 'Layout',
            tableName: 'aLayout',
            tableNameModes: {
              full: 'aLayoutViewFull',
            },
            resource: true,
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'layout',
          search: {
            validator: 'layoutSearch',
          },
        },
      },
      resources: {
        button: {
          title: 'Sidebar Button',
        },
        panel: {
          title: 'Sidebar Panel',
        },
      },
      statics: {
        'a-layoutpc.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        layout: {
          schemas: 'layout',
        },
        layoutSearch: {
          schemas: 'layoutSearch',
        },
      },
      keywords: {},
      schemas: {
        layout: schemas.layout,
        layoutSearch: schemas.layoutSearch,
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 687:
/***/ ((module) => {

module.exports = app => {
  class Layout extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aLayout', options: { disableDeleted: false } });
    }
  }
  return Layout;
};


/***/ }),

/***/ 535:
/***/ ((module) => {

module.exports = app => {
  class LayoutContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aLayoutContent', options: { disableDeleted: false } });
    }
  }
  return LayoutContent;
};


/***/ }),

/***/ 0:
/***/ ((module) => {

module.exports = app => {
  class LayoutFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aLayoutViewFull', options: { disableDeleted: false } });
    }
  }
  return LayoutFull;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layout = __webpack_require__(687);
const layoutContent = __webpack_require__(535);
const layoutFull = __webpack_require__(0);

module.exports = app => {
  const models = {
    layout,
    layoutContent,
    layoutFull,
  };
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