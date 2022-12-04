/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 183:
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
        // create roles: cms-community-writer to template
        const roles = ['cms-community-writer'];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        const roleActivated = await this.ctx.bean.role.getSystemRole({ roleName: 'activated' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-community
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
          // role:activated include cms-community-writer
          if (roleName === 'cms-community-writer') {
            await this.ctx.bean.role.addRoleInc({ roleId: roleActivated.id, roleIdInc: roleId });
          }
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-community-writer', action: 'create' },
          { roleName: 'cms-community-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-community-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'deleteBulk' },
          { roleName: 'cms-community-writer', action: 'exportBulk' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'post', roleRights });
      }

      if (options.version === 2) {
        // add role rights
        const roleRights = [
          { roleName: 'root', action: 'layout', scopeNames: 'root' }, //
          { roleName: 'root', action: 'preview', scopeNames: 'root' }, //
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'post', roleRights });
      }
    }

    async test() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'post',
      };
      const categories = [
        // en-us
        { categoryName: 'Share', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: 'Answer', language: 'en-us', categoryIdParent: 0, categorySorting: 2 },
        { categoryName: 'Announcement', language: 'en-us', categoryIdParent: 0, categorySorting: 3 },
        // zh-cn
        { categoryName: '分享', language: 'zh-cn', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: '问答', language: 'zh-cn', categoryIdParent: 0, categorySorting: 2 },
        { categoryName: '公告', language: 'zh-cn', categoryIdParent: 0, categorySorting: 3 },
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
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomPost = __webpack_require__(183);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.post': {
      mode: 'app',
      bean: atomPost,
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
      title: 'Community',
      subTitle: 'Everything About CabloyJS',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://localhost',
      rootPath: 'cms-test-community',
    },
    language: {
      default: 'en-us',
      items: 'en-us,zh-cn',
    },
    themes: {
      'en-us': 'cms-themecommunity',
      'zh-cn': 'cms-themecommunity',
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

module.exports = {
  CMSPostTitle: 'Post',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'CMS:Community': 'CMS:社区',
  CMSPostTitle: '帖子',
  'Create Post': '新建帖子',
  'Post List': '帖子列表',
  'Post List(by Category)': '帖子列表(按目录)',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 481:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const info = {
    home: {
      mode: 'page',
      page: '/a/basefront/atom/list?module=cms-sitecommunity&atomClassName=post',
    },
  };
  const content = {
    info: {
      atomClass: {
        module: moduleInfo.relativeName,
        atomClassName: 'post',
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
    atomName: 'Community',
    atomStaticKey: 'appCommunity',
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

const appCommunity = __webpack_require__(481);

module.exports = app => {
  const apps = [
    //
    appCommunity(app),
  ];
  return apps;
};


/***/ }),

/***/ 801:
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
              atomClassName: 'post',
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
    atomName: 'Community Post Publish',
    atomStaticKey: 'flowPostPublish',
    atomRevision: 100,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const postPublish = __webpack_require__(801);

module.exports = app => {
  const flowDefs = [postPublish(app)];
  return flowDefs;
};


/***/ }),

/***/ 16:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      orders: [{ name: 'sticky', title: 'Sticky', by: 'desc', tableAlias: 'p' }],
    },
  };
  const layout = {
    atomName: 'CMSPostTitle',
    atomStaticKey: 'layoutAtomListPost',
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

const layoutAtomListPost = __webpack_require__(16);

module.exports = app => {
  const layouts = [layoutAtomListPost(app)];
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
      atomName: 'Create Post',
      atomStaticKey: 'createPost',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'post',
        atomAction: 'create',
      }),
      resourceIcon: '::add',
      appKey: 'cms-sitecommunity:appCommunity',
      resourceRoles: 'template.cms-community-writer',
    },
    {
      atomName: 'Post List',
      atomStaticKey: 'listPost',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'post',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:data-list-outline',
      appKey: 'cms-sitecommunity:appCommunity',
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
  // post
  schemas.post = {
    type: 'object',
    properties: {
      atomId: {
        type: 'number',
      },
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
        ebGroupWhole: true,
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
    },
  };
  // post search
  schemas.postSearch = {
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
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = __webpack_require__(232)(app);
  const staticApps = __webpack_require__(241)(app);
  const staticFlowDefs = __webpack_require__(772)(app);
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  const meta = {
    base: {
      atoms: {
        post: {
          info: {
            bean: 'post',
            title: 'CMSPostTitle',
            tableName: '',
            tableNameModes: {
              default: '',
              full: '',
              search: '',
            },
            language: true,
            category: true,
            tag: true,
            cms: true,
            layout: {
              config: {
                atomList: 'layoutAtomListPost',
              },
            },
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
          validator: 'post',
          search: {
            validator: 'postSearch',
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
        post: {
          schemas: 'post',
        },
        postSearch: {
          schemas: 'postSearch',
        },
      },
      keywords: {},
      schemas: {
        post: schemas.post,
        postSearch: schemas.postSearch,
      },
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