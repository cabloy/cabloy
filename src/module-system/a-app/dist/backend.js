/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 906:
/***/ ((module) => {

module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add app
      const res = await this.ctx.model.app.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      const content = {};
      await this.ctx.model.appContent.insert({
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
      // update app
      const data = await this.ctx.model.app.prepareData(item);
      await this.ctx.model.app.update(data);
      // update content
      await this.ctx.model.appContent.update(
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

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete app
      await this.ctx.model.app.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.appContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item) {
      // locale of atomCategoryName
      item.atomCategoryNameLocale = this.ctx.text(item.atomCategoryName);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = this.ctx.text(item.description);
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
      if (options.version === 1) {
        // create table: aApp
        let sql = `
          CREATE TABLE aApp (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            appSorting int(11) DEFAULT '0',
            appIcon varchar(255) DEFAULT NULL,
            appIsolate int(11) DEFAULT '0',
            appLanguage int(11) DEFAULT '0',
            appCms int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aAppContent
        sql = `
          CREATE TABLE aAppContent (
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

        // create view: aAppViewFull
        sql = `
          CREATE VIEW aAppViewFull as
            select a.*,b.content from aApp a
              left join aAppContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        let sql = `
          ALTER TABLE aApp
            ADD COLUMN appHidden int(11) DEFAULT '0'
        `;
        await this.ctx.model.query(sql);

        // alter view: aAppViewFull
        await this.ctx.model.query('drop view aAppViewFull');
        sql = `
          CREATE VIEW aAppViewFull as
            select a.*,b.content from aApp a
              left join aAppContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // app: add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'clone', scopeNames: 0 },
          { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'authorize', scopeNames: 0 },
          { roleName: 'system', action: 'authorize', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'app', roleRights });
      }
    }

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomApp = __webpack_require__(906);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.app': {
      mode: 'app',
      bean: atomApp,
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
  AppMenu: 'App Menu',
  AppHome: 'App Home',
  AppCategoryFront: 'Front Apps',
  AppCategoryBackend: 'Backend Apps',
  AppCategoryManagement: 'Management',
  AppCategoryServices: 'Services',
  AppCategoryCMS: 'CMS',
  AppCategoryBusiness: 'Business',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  App: '应用',
  Apps: '应用',
  'Create App': '新建应用',
  'App List': '应用列表',
  AppMenu: '应用菜单',
  AppHome: '应用首页',
  Icon: '图标',
  AppCategoryFront: '前台应用',
  AppCategoryBackend: '后台应用',
  AppCategoryManagement: '管理',
  AppCategoryServices: '服务',
  AppCategoryCMS: 'CMS',
  AppCategoryBusiness: '业务',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 413:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          mine: {
            layout: null,
          },
        },
        pc: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          mine: {
            layout: null,
          },
        },
      },
      authenticated: {
        mobile: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          mine: {
            layout: null,
          },
        },
        pc: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          mine: {
            layout: null,
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'Base',
    atomStaticKey: 'appBase',
    atomRevision: 1,
    atomCategoryId: 0,
    description: '',
    appIcon: ':outline:apps-outline',
    appIsolate: true,
    appHidden: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};


/***/ }),

/***/ 123:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          layout: 'a-layoutmobile:layoutMobileAnonymous',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardAnonymous',
            page: null,
          },
          mine: {
            layout: true,
          },
        },
        pc: {
          layout: 'a-layoutpc:layoutPCAnonymous',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardAnonymous',
            page: null,
          },
          mine: {
            layout: true,
          },
        },
      },
      authenticated: {
        mobile: {
          layout: 'a-layoutmobile:layoutMobile',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardHome',
            page: null,
          },
          mine: {
            layout: true,
          },
        },
        pc: {
          layout: 'a-layoutpc:layoutPC',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardHome',
            page: null,
          },
          mine: {
            layout: true,
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'Default',
    atomStaticKey: 'appDefault',
    atomRevision: 3,
    atomCategoryId: 0,
    description: '',
    appIcon: ':outline:apps-outline',
    appIsolate: true,
    appHidden: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};


/***/ }),

/***/ 241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const appBase = __webpack_require__(413);
const appDefault = __webpack_require__(123);

module.exports = app => {
  const apps = [appBase(app), appDefault(app)];
  return apps;
};


/***/ }),

/***/ 473:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListTitle',
            },
          },
        },
      },
      list: {
        providerOptions: {
          providerName: 'all',
          autoInit: true,
        },
        subnavbar: false,
        blocks: {
          items: {
            component: {
              module: 'a-app',
              name: 'appMenuLayoutBlockListItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAppMenuBase',
    atomRevision: 4,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 65:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'boxGrid9',
          medium: 'boxGrid9',
          large: 'boxGrid9',
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      boxGrid9: {
        title: 'LayoutBoxGrid9',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        providerOptions: {
          providerName: 'all',
          autoInit: true,
        },
        blocks: {
          items: {
            component: {
              module: 'a-app',
              name: 'appListLayoutBlockBoxGrid9Items',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Default',
    atomStaticKey: 'layoutAppMenuDefault',
    atomRevision: 2,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 417:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                },
              },
              {
                dataIndex: 'description',
                title: 'Description',
                align: 'left',
              },
              {
                dataIndex: 'userName',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellUserName',
                },
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'left',
              },
              {
                dataIndex: 'atomUpdatedAt',
                title: 'Modification Time',
                align: 'left',
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'App',
    atomStaticKey: 'layoutAtomListApp',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutAtomListApp = __webpack_require__(417);
const layoutAppMenuBase = __webpack_require__(473);
const layoutAppMenuDefault = __webpack_require__(65);

module.exports = app => {
  const layouts = [layoutAtomListApp(app), layoutAppMenuBase(app), layoutAppMenuDefault(app)];
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
      atomName: 'Create App',
      atomStaticKey: 'createApp',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'app',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:apps-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Apps',
      atomStaticKey: 'listApp',
      atomRevision: 3,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'app',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:apps-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 251:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // app
  schemas.app = {
    type: 'object',
    properties: {
      // title
      __groupTitle: {
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      // config
      __groupConfig: {
        ebType: 'group-flatten',
        ebTitle: 'Config',
      },
      content: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Content',
        notEmpty: true,
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
      },
      appIcon: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Icon',
        notEmpty: true,
      },
      appIsolate: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'AppIsolateTitle',
      },
      appHidden: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'AppHiddenTitle',
      },
      appLanguage: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'AppLanguageTitle',
      },
      appCms: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'AppCmsTitle',
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      appSorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
        ebReadOnly: true,
        notEmpty: true,
      },
    },
  };
  // app search
  schemas.appSearch = {
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

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const schemaApp = __webpack_require__(251);

module.exports = app => {
  const schemas = {};
  // app
  Object.assign(schemas, schemaApp(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 696:
/***/ ((module) => {

module.exports = app => {
  class ResourceController extends app.Controller {
    async read() {
      const res = await this.ctx.service.resource.read({
        atomStaticKey: this.ctx.request.body.atomStaticKey,
        options: this.ctx.request.body.options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return ResourceController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resource = __webpack_require__(696);
module.exports = app => {
  const controllers = { resource };
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
      atoms: {
        app: {
          info: {
            bean: 'app',
            title: 'App',
            tableName: 'aApp',
            tableNameModes: {
              full: 'aAppViewFull',
            },
            inner: true,
            resource: true,
            language: false,
            category: true,
            tag: false,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'layoutAtomListApp',
              },
            },
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'app',
          search: {
            validator: 'appSearch',
          },
        },
      },
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
      validators: {
        app: {
          schemas: 'app',
        },
        appSearch: {
          schemas: 'appSearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: { aApp: 'createdAt,updatedAt,atomId' },
    },
  };
  return meta;
};


/***/ }),

/***/ 774:
/***/ ((module) => {

module.exports = app => {
  class App extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aApp', options: { disableDeleted: false } });
    }
  }
  return App;
};


/***/ }),

/***/ 179:
/***/ ((module) => {

module.exports = app => {
  class AppContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAppContent', options: { disableDeleted: false } });
    }
  }
  return AppContent;
};


/***/ }),

/***/ 758:
/***/ ((module) => {

module.exports = app => {
  class AppFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAppViewFull', options: { disableDeleted: false } });
    }
  }
  return AppFull;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const _app = __webpack_require__(774);
const appContent = __webpack_require__(179);
const appFull = __webpack_require__(758);

module.exports = app => {
  const models = { app: _app, appContent, appFull };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // resource
    { method: 'post', path: 'resource/read', controller: 'resource' },
  ];
  return routes;
};


/***/ }),

/***/ 55:
/***/ ((module) => {

module.exports = app => {
  class Resource extends app.Service {
    async read({ atomStaticKey, options, user }) {
      // donot check user access right, but must check atomClass
      const appItem = await this.ctx.bean.resource.readByStaticKey({ atomStaticKey, options /* , user*/ });
      if (appItem.module !== 'a-app' || appItem.atomClassName !== 'app') this.ctx.throw(403);
      return appItem;
    }
  }

  return Resource;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resource = __webpack_require__(55);
module.exports = app => {
  const services = { resource };
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