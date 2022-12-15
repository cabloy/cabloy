/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 697:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add dict
      const res = await this.ctx.model.dict.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.dictContent.insert({
        atomId: key.atomId,
        itemId,
        dictItems: '[]',
        dictLocales: '{}',
      });
      // return key
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
      const atomStaticKey = item.atomStaticKey;
      const atomStage = item.atomStage;
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update dict
      const data = await this.ctx.model.dict.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.dict.update(data);
      // update content
      await this.ctx.model.dictContent.update(
        {
          dictItems: item.dictItems,
          dictLocales: item.dictLocales,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
      // remove dict cache
      if (atomStage === 1) {
        this.ctx.tail(() => {
          this.ctx.bean.dict.dictCacheRemove({ dictKey: atomStaticKey });
        });
      }
    }

    async delete({ atomClass, key, options, user }) {
      const item = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      const atomStaticKey = item.atomStaticKey;
      const atomStage = item.atomStage;
      // super
      await super.delete({ atomClass, key, options, user });
      // delete dict
      await this.ctx.model.dict.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.dictContent.delete({
        itemId: key.itemId,
      });
      // remove dict cache
      if (atomStage === 1) {
        this.ctx.tail(() => {
          this.ctx.bean.dict.dictCacheRemove({ dictKey: atomStaticKey });
        });
      }
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

/***/ 784:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Dict extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'dict');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get cacheMem() {
      return ctx.cache.mem.module(moduleInfo.relativeName);
    }

    get atomClass() {
      return {
        module: moduleInfo.relativeName,
        atomClassName: 'dict',
      };
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).dict;
    }

    get modelDictContent() {
      return ctx.model.module(moduleInfo.relativeName).dictContent;
    }

    // options: separator
    //  find by code or title
    async findItem({ dictKey, code, title, options }) {
      let findByCode;
      if (!this._checkIfEmptyForSelect(code)) {
        code = String(code);
        findByCode = true;
      } else if (title) {
        findByCode = false;
      } else {
        return null;
      }
      // options
      options = options || { separator: '/' };
      const separator = options.separator;
      // locale
      const locale = ctx.locale;
      // dict
      const dict = await this.getDict({ dictKey, locale });
      if (!dict._cacheCode) dict._cacheCode = {};
      if (!dict._cacheTitle) dict._cacheTitle = {};
      let dictItemRes = findByCode ? dict._cacheCode[code] : dict._cacheTitle[title];
      if (dictItemRes) return dictItemRes;
      // find
      const dictItemsRes = [];
      const res = this._findItem_loop({
        dictItemsRes,
        dictItems: dict._dictItems,
        dictItemsMap: dict._dictItemsMap,
        codes: findByCode ? code.split(separator) : undefined,
        titles: findByCode ? undefined : title.split(separator),
        findByCode,
      });
      if (!res) return null;
      const codeFull = findByCode ? code : dictItemsRes.map(item => item.code).join(separator);
      const titleFull = dictItemsRes.map(item => item.title).join(separator);
      const titleLocaleFull = dictItemsRes.map(item => item.titleLocale).join(separator);
      dictItemRes = {
        ...dictItemsRes[dictItemsRes.length - 1],
        codeFull,
        titleFull,
        titleLocaleFull,
      };
      // cache
      if (findByCode) {
        dict._cacheCode[code] = dictItemRes;
      } else {
        dict._cacheTitle[title] = dictItemRes;
      }
      // ok
      return dictItemRes;
    }

    _findItem_loop({ dictItemsRes, dictItems, dictItemsMap, codes, titles, findByCode }) {
      let dictItem;
      if (findByCode) {
        const code = codes.shift();
        dictItem = dictItemsMap && dictItemsMap[code];
        if (!dictItem) return false;
        dictItemsRes.push(dictItem);
        if (codes.length === 0) return true;
      } else {
        const title = titles.shift();
        dictItem = dictItems && dictItems.find(item => item.title === title || item.titleLocale === title);
        if (!dictItem) return false;
        dictItemsRes.push(dictItem);
        if (titles.length === 0) return true;
      }
      return this._findItem_loop({
        dictItemsRes,
        dictItems: dictItem.children,
        dictItemsMap: dictItem._childrenMap,
        codes,
        titles,
        findByCode,
      });
    }

    async getDict({ dictKey, locale }) {
      locale = locale || ctx.locale;
      let dict = this.cacheMem.get(dictKey);
      if (dict && dict[locale]) return dict[locale];
      if (!dict) {
        dict = {};
      }
      if (!dict[locale]) {
        dict[locale] = await this._prepareDict({ dictKey, locale });
      }
      this.cacheMem.set(dictKey, dict);
      return dict[locale];
    }

    dictCacheRemove({ dictKey }) {
      this.cacheMem.remove(dictKey);
    }

    async _prepareDict({ dictKey, locale }) {
      // load
      const dict = await this._prepareDict_load({ dictKey, user: null, returnDict: true });
      // prepare
      this._prepareDict_adjust({ dict, locale });
      // ok
      return dict;
    }

    async _prepareDict_load({ dictKey, user, returnDict }) {
      if (!dictKey) throw new Error('dictKey not set');
      // get atomId
      let atomId;
      const atomClass = await ctx.bean.atomClass.get(this.atomClass);
      const atom = await ctx.bean.atom.modelAtom.get({
        atomClassId: atomClass.id,
        atomStaticKey: dictKey,
        atomStage: 1,
      });
      if (!atom) {
        // try preload
        const atomKey = await ctx.bean.atomStatic.preloadAtomStatic({ atomStaticKey: dictKey });
        if (!atomKey) throw new Error(`dict not found: ${dictKey}`);
        atomId = atomKey.atomId;
      } else {
        atomId = atom.id;
      }
      // check resource right
      if (user) {
        const res = await ctx.bean.resource.checkRightResource({ resourceAtomId: atomId, user });
        if (!res) ctx.throw(403);
      }
      if (!returnDict) return true;
      // read
      const dict = await ctx.bean.atom.read({ key: { atomId } });
      if (!dict) return ctx.throw.module('a-base', 1002);
      // ok
      return dict;
    }

    _prepareDict_adjust({ dict, locale }) {
      // init
      dict._dictItems = JSON.parse(dict.dictItems);
      dict._dictLocales = dict.dictLocales ? JSON.parse(dict.dictLocales) : null;
      dict._dictItemsMap = {};
      // adjust
      this._prepareDict_adjust_loop({
        dict,
        dictItemsMap: dict._dictItemsMap,
        dictItems: dict._dictItems,
        locale,
      });
    }

    _prepareDict_adjust_loop({ dict, dictItemsMap, dictItems, locale }) {
      for (const item of dictItems) {
        // self
        item.titleLocale = this._prepareDict_titleLocale({ dict, title: item.title, locale });
        dictItemsMap[item.code] = item;
        // children
        if (item.children) {
          item._childrenMap = {};
          this._prepareDict_adjust_loop({
            dict,
            dictItemsMap: item._childrenMap,
            dictItems: item.children,
            locale,
          });
        }
      }
    }

    _prepareDict_titleLocale({ dict, title, locale }) {
      return ctx.bean.util.getTitleLocale({
        locales: dict._dictLocales,
        title,
        locale,
      });
    }

    _checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    }
  }

  return Dict;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aDict
        let sql = `
          CREATE TABLE aDict (
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
        // create table: aDictContent
        sql = `
          CREATE TABLE aDictContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            dictItems JSON DEFAULT NULL,
            dictLocales JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
        // create view: aDictViewFull
        sql = `
          CREATE VIEW aDictViewFull as
            select a.*,b.dictItems,b.dictLocales from aDict a
              left join aDictContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // // add role rights
        // const roleRights = [
        //   { roleName: 'system', action: 'create' },
        //   { roleName: 'system', action: 'read', scopeNames: 0 },
        //   { roleName: 'system', action: 'read', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'write', scopeNames: 0 },
        //   { roleName: 'system', action: 'write', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'delete', scopeNames: 0 },
        //   { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'clone', scopeNames: 0 },
        //   { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'authorize', scopeNames: 0 },
        //   { roleName: 'system', action: 'authorize', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'deleteBulk' },
        //   { roleName: 'system', action: 'exportBulk' },
        // ];
        // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dict', roleRights });
      }

      if (options.version === 2) {
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
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dict', roleRights });
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
const atomDict = __webpack_require__(697);
const beanDict = __webpack_require__(784);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.dict': {
      mode: 'app',
      bean: atomDict,
    },
    // global
    dict: {
      mode: 'ctx',
      bean: beanDict,
      global: true,
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

module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Dict: '字典',
  Dicts: '字典',
  'Create Dict': '新建字典',
  'Dict List': '字典列表',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 633:
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
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'atomUpdatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Dict',
    atomStaticKey: 'layoutAtomListDict',
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

const layoutAtomListDict = __webpack_require__(633);

module.exports = app => {
  const layouts = [layoutAtomListDict(app)];
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
      atomName: 'Create Dict',
      atomStaticKey: 'createDict',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dict',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:dict-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Dicts',
      atomStaticKey: 'listDict',
      atomRevision: 3,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dict',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:dict-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 392:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // dict
  schemas.dict = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
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
      dictItems: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Dict Items',
        notEmpty: true,
      },
      dictLocales: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Dict Locales',
        notEmpty: true,
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
        ebReadOnly: true,
        notEmpty: true,
      },
      atomRevision: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Revision',
        ebReadOnly: true,
      },
    },
  };
  // dict search
  schemas.dictSearch = {
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

const dict = __webpack_require__(392);

module.exports = app => {
  const schemas = {};
  // dict
  Object.assign(schemas, dict(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 560:
/***/ ((module) => {

module.exports = app => {
  class DictController extends app.Controller {
    async getDict() {
      const res = await this.ctx.service.dict.getDict({
        dictKey: this.ctx.request.body.dictKey,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return DictController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const dict = __webpack_require__(560);

module.exports = app => {
  const controllers = {
    dict,
  };
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
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      atoms: {
        dict: {
          info: {
            bean: 'dict',
            title: 'Dict',
            tableName: 'aDict',
            tableNameModes: {
              full: 'aDictViewFull',
            },
            inner: true,
            resource: true,
            language: false,
            category: false,
            tag: false,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'layoutAtomListDict',
              },
            },
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'dict',
          search: {
            validator: 'dictSearch',
          },
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
      validators: {
        dict: {
          schemas: 'dict',
        },
        dictSearch: {
          schemas: 'dictSearch',
        },
      },
      keywords: {},
      schemas,
    },
  };
  return meta;
};


/***/ }),

/***/ 810:
/***/ ((module) => {

module.exports = app => {
  class Dict extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDict', options: { disableDeleted: false } });
    }
  }
  return Dict;
};


/***/ }),

/***/ 264:
/***/ ((module) => {

module.exports = app => {
  class DictContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDictContent', options: { disableDeleted: false } });
    }
  }
  return DictContent;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const dict = __webpack_require__(810);
const dictContent = __webpack_require__(264);

module.exports = app => {
  const models = {
    dict,
    dictContent,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [{ method: 'post', path: 'dict/getDict', controller: 'dict' }];
  return routes;
};


/***/ }),

/***/ 698:
/***/ ((module) => {

module.exports = app => {
  class Dict extends app.Service {
    async getDict({ dictKey, user }) {
      // check right
      const res = await this.ctx.bean.dict._prepareDict_load({ dictKey, user, returnDict: false });
      if (!res) this.ctx.throw(403);
      // get dict
      const dict = await this.ctx.bean.dict.getDict({ dictKey });
      // short
      return {
        atomId: dict.atomId,
        description: dict.description,
        _dictItems: dict._dictItems,
      };
    }
  }

  return Dict;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const dict = __webpack_require__(698);

module.exports = app => {
  const services = {
    dict,
  };
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