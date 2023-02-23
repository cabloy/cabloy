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
      const content = {};
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
      this._getMeta(item, options);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item, options);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      this.ctx.bean.util.checkDemoForAtomWrite();
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update layout
      const data = await this.ctx.model.layout.prepareData(item);
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

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete layout
      await this.ctx.model.layout.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.layoutContent.delete({
        itemId: key.itemId,
      });
    }

    _getMeta(item, options) {
      // layout: list/table/mobile/pc
      const layout = options && options.layout;
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (layout !== 'table') {
        meta.flags.push(item._layoutTypeCodeTitleLocale);
      }
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
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    get modelRoleRight() {
      return this.ctx.model.module('a-base').roleRight;
    }

    async update(options) {
      if (options.version === 1) {
        // create table: aLayout
        let sql = `
          CREATE TABLE if not exists aLayout (
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

        // aLayout
        sql = `
          ALTER TABLE aLayout
            Add COLUMN layoutTypeCode INT(11) DEFAULT '0'
          `;
        await this.ctx.model.query(sql);

        // create table: aLayoutContent
        sql = `
          CREATE TABLE if not exists aLayoutContent (
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
        await this.ctx.model.query('drop view if exists aLayoutViewFull');
        sql = `
          CREATE VIEW aLayoutViewFull as
            select a.*,b.content from aLayout a
              left join aLayoutContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);

        // update atomClassLayout
        await this._update_atomClassLayout();
      }
    }

    async init(options) {
      if (options.version === 1) {
        // check if exists
        const roleSystem = await this.ctx.bean.role.getSystemRole({ roleName: 'system' });
        const atomClassLayout = await this.ctx.bean.atomClass.get({
          module: moduleInfo.relativeName,
          atomClassName: 'layout',
        });
        const exists = await this.modelRoleRight.get({
          roleId: roleSystem.id,
          atomClassId: atomClassLayout.id,
          action: 1,
        });
        if (!exists) {
          // add role rights
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
          await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'layout', roleRights });
        }
      }
    }

    async _update_atomClassLayout() {
      // update atomClass from a-layoutpc to a-baselayout
      //   all iid
      await this.ctx.model.query('update aAtomClass set module=? where module=? and atomClassName=?', [
        'a-baselayout',
        'a-layoutpc',
        'layout',
      ]);
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

/***/ 72:
/***/ ((module) => {

module.exports = {
  Layout: '布局',
  Layouts: '布局',
  'Create Layout': '新建布局',
  'Layout List': '布局列表',
  'Layout Type': '布局类型',
  'Base Layout': '基础布局',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
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
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'layout',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:layout-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Layouts',
      atomStaticKey: 'listLayout',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'layout',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:layout-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
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
            actionModule: 'a-basefront',
            actionComponent: 'combineSearch',
            name: 'atomName',
          },
        },
      },
      role: {
        type: 'number',
        ebType: null, // 'role',
        ebTitle: 'TitleRoleOrg',
        ebParams: {
          roleIdStart: null,
          multiple: false,
          catalogOnly: false,
          leafOnly: false,
          roleTypes: [0, 1, 2, 3, 4],
          mapper: {
            role: 'itemId',
            roleName: 'atomName',
            roleNameLocale: 'atomNameLocale',
          },
        },
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
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
      mine: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Mine',
        ebDisplay: {
          expression: '!_meta.host.container.options || !_meta.host.container.options.mine',
        },
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
            actionModule: 'a-basefront',
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

/***/ 637:
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
      layoutTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Layout Type',
        ebOptionsBlankAuto: true,
        ebParams: {
          dictKey: 'a-dictbooster:dictLayoutType',
          mode: 'select',
        },
        notEmpty: {
          ignoreZero: true,
        },
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
      layoutTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Layout Type',
        ebParams: {
          dictKey: 'a-dictbooster:dictLayoutType',
          mode: 'select',
        },
        ebOptionsBlankAuto: true,
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
const layout = __webpack_require__(637);

module.exports = app => {
  const schemas = {};
  // filterTabBasic
  Object.assign(schemas, filterTabBasic(app));
  // filterTabGeneral
  Object.assign(schemas, filterTabGeneral(app));
  // layout
  Object.assign(schemas, layout(app));
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
  // schemas
  const schemas = __webpack_require__(232)(app);
  // static
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
            inner: true,
            resource: true,
            comment: false,
            attachment: false,
            dict: {
              fields: {
                layoutTypeCode: {
                  dictKey: 'a-dictbooster:dictLayoutType',
                },
              },
            },
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
      statics: {
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
      schemas,
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