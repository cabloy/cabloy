/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 957:
/***/ ((module) => {

module.exports = app => {
  class Atom extends app.meta.AtomCmsBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      return { atomId: key.atomId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
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
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-documentation-writer to template
        const roles = ['cms-documentation-writer'];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-documentation
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-documentation-writer', action: 'create' },
          { roleName: 'cms-documentation-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-documentation-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-documentation-writer', action: 'deleteBulk' },
          { roleName: 'cms-documentation-writer', action: 'exportBulk' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
          { roleName: 'root', action: 'layout', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'preview', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'document', roleRights });
      }
    }

    async test() {
      await this._test_categories_tags();
    }

    async _test_categories_tags() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'document',
      };
      // categories
      const categories = [
        // en-us
        { categoryName: 'test1', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2-1', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test2-2', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test3', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: 'testHidden', language: 'en-us', categoryIdParent: 0, categoryHidden: 1 },
        { categoryName: 'testFlag', language: 'en-us', categoryIdParent: 0, categoryFlag: 'Flag' },
        // zh-cn
        { categoryName: '目录1', language: 'zh-cn', categoryIdParent: 0 },
        { categoryName: '目录2', language: 'zh-cn', categoryIdParent: 0 },
        { categoryName: '目录2-1', language: 'zh-cn', categoryIdParent: '目录2' },
        { categoryName: '目录2-2', language: 'zh-cn', categoryIdParent: '目录2' },
        { categoryName: '目录3', language: 'zh-cn', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: '隐藏目录', language: 'zh-cn', categoryIdParent: 0, categoryHidden: 1 },
        { categoryName: '加标记的目录', language: 'zh-cn', categoryIdParent: 0, categoryFlag: 'Flag' },
      ];
      const categoryIds = {};
      for (const item of categories) {
        // add
        const categoryId = await this.ctx.bean.category.add({
          atomClass,
          data: {
            language: item.language,
            categoryName: item.categoryName,
            categoryHidden: item.categoryHidden,
            categorySorting: item.categorySorting,
            categoryFlag: item.categoryFlag,
            categoryIdParent: item.categoryIdParent ? categoryIds[item.categoryIdParent] : 0,
          },
        });
        categoryIds[item.categoryName] = categoryId;
      }
      // tags
      const tags = [
        // en-us
        { tagName: 'Life', language: 'en-us' },
        { tagName: 'Study', language: 'en-us' },
        { tagName: 'Work', language: 'en-us' },
        // zh-cn
        { tagName: '生活', language: 'zh-cn' },
        { tagName: '学习', language: 'zh-cn' },
        { tagName: '工作', language: 'zh-cn' },
      ];
      const tagIds = {};
      for (const item of tags) {
        // add
        const tagId = await this.ctx.bean.tag.add({
          atomClass,
          data: {
            language: item.language,
            tagName: item.tagName,
          },
        });
        tagIds[item.tagName] = tagId;
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomDocument = __webpack_require__(957);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.document': {
      mode: 'app',
      bean: atomDocument,
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

  // site
  config.cms = {};
  config.cms.site = {
    base: {
      title: 'Documentations',
      subTitle: 'Everything About CabloyJS',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://localhost',
      rootPath: 'cms-test-documentation',
    },
    language: {
      default: 'en-us',
      items: 'en-us,zh-cn',
    },
    themes: {
      'en-us': 'cms-themedocs',
      'zh-cn': 'cms-themedocs',
    },
    edit: {
      mode: 1, // markdown
    },
    env: {
      format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
      },
      article2: {
        recentNum: 5,
      },
      comment: {
        order: 'asc',
        recentNum: 5,
      },
      brother: {
        order: 'desc',
      },
      loadMore: {
        loadOnScroll: false,
      },
    },
    profile: {},
    beian: {
      icp: '',
    },
  };

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
  'CMS:Documentation': 'CMS:文档',
  Document: '文档',
  'Create Document': '新建文档',
  'Document List': '文档列表',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 389:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const info = {
    home: {
      mode: 'page',
      page: '/a/basefront/atom/list?module=cms-sitedocumentation&atomClassName=document',
    },
  };
  const content = {
    info: {
      atomClass: {
        module: moduleInfo.relativeName,
        atomClassName: 'document',
      },
    },
    presets: {
      anonymous: {
        mobile: info,
        pc: info,
      },
      authenticated: {
        mobile: info,
        pc: info,
      },
    },
  };
  const _app = {
    atomName: 'Documentation',
    atomStaticKey: 'appDocumentation',
    atomRevision: 4,
    atomCategoryId: 'AppCategoryFront',
    description: '',
    appIcon: ':outline:article-outline',
    appIsolate: false,
    appLanguage: true,
    appCms: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};


/***/ }),

/***/ 241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const appDocumentation = __webpack_require__(389);

module.exports = app => {
  const apps = [
    //
    appDocumentation(app),
  ];
  return apps;
};


/***/ }),

/***/ 734:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: null,
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Drafting',
          type: 'startEventAtom',
          options: {
            atom: {
              module: moduleInfo.relativeName,
              atomClassName: 'document',
            },
            conditionExpression: null,
          },
        },
        {
          id: 'activity_1',
          name: 'Review',
          type: 'activityUserTask',
          options: {
            assignees: {
              roles: 'superuser',
            },
            confirmation: false,
            bidding: true,
            schema: {
              write: {
                module: 'a-cms',
                schema: 'article',
              },
            },
          },
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventAtom',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'CMS Document Publish',
    atomStaticKey: 'flowDocumentPublish',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const documentPublish = __webpack_require__(734);

module.exports = app => {
  const flowDefs = [documentPublish(app)];
  return flowDefs;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Document',
      atomStaticKey: 'createDocument',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'document',
        atomAction: 'create',
      }),
      resourceIcon: '::add',
      appKey: 'cms-sitedocumentation:appDocumentation',
      resourceRoles: 'template.cms-documentation-writer',
    },
    {
      atomName: 'Document List',
      atomStaticKey: 'listDocument',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'document',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:data-list-outline',
      appKey: 'cms-sitedocumentation:appDocumentation',
      resourceRoles: 'root',
    },
  ];
  return resources;
};


/***/ }),

/***/ 672:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // document
  schemas.document = {
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
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      // content
      __groupContent: {
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'markdown-content-cms',
        ebTitle: 'Content',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomLanguage: {
        type: 'string',
        ebType: 'language',
        ebTitle: 'Language',
        notEmpty: true,
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
        notEmpty: true,
      },
      atomTags: {
        type: ['string', 'null'],
        ebType: 'tags',
        ebTitle: 'Tags',
      },
      keywords: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Keywords',
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebParams: {
          textarea: true,
        },
        ebTitle: 'Description',
      },
      imageCover: {
        type: 'string',
        ebType: 'file',
        ebTitle: 'ArticleCover',
        ebParams: { mode: 1 },
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      slug: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Slug',
        'x-slug': true,
      },
      sticky: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Sticky',
        default: false,
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      allowComment: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Comment',
        default: true,
      },
      flag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      extra: {
        type: 'string',
        ebType: 'text',
        ebParams: {
          textarea: true,
        },
        ebTitle: 'Extra Attributes',
      },
    },
  };

  // document search
  schemas.documentSearch = {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
        ebSearch: {
          tableAlias: 'q',
        },
      },
    },
  };

  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const document = __webpack_require__(672);

module.exports = app => {
  const schemas = {};
  // document
  Object.assign(schemas, document(app));
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
  const staticFlowDefs = __webpack_require__(772)(app);
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      atoms: {
        document: {
          info: {
            bean: 'document',
            title: 'Document',
            tableName: '',
            language: true,
            category: true,
            tag: true,
            cms: true,
          },
          actions: {
            preview: {
              code: 101,
              title: 'Preview',
              actionModule: 'a-cms',
              actionComponent: 'action',
              icon: { f7: '::preview' },
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'draft,formal',
            },
          },
          validator: 'document',
          search: {
            validator: 'documentSearch',
          },
        },
      },
      statics: {
        'a-app.app': {
          items: staticApps,
        },
        'a-flow.flowDef': {
          items: staticFlowDefs,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        document: {
          schemas: 'document',
        },
        documentSearch: {
          schemas: 'documentSearch',
        },
      },
      keywords: {},
      schemas,
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