module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(4);
const middlewares = __webpack_require__(5);

module.exports = app => {

  // routes
  const routes = __webpack_require__(6)(app);
  // services
  const services = __webpack_require__(10)(app);
  // models
  const models = __webpack_require__(15)(app);
  // meta
  const meta = __webpack_require__(17)(app);

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    meta,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // site
  config.site = {
    base: {
      title: 'Community',
      subTitle: 'Everything about CabloyJS',
      description: '',
      keywords: '',
      publishOnSubmit: true,
    },
    host: {
      url: 'http://community.example.com',
      rootPath: '',
    },
    language: {
      default: 'en-us',
      items: 'en-us',
    },
    themes: {
      'en-us': 'cms-themecommunity',
    },
    edit: {
      mode: 1, // markdown
    },
    env: {
      format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
      },
      comment: {
        order: 'asc',
        recentNum: 5,
      },
      brother: {
        order: 'desc',
      },
    },
    profile: {

    },
  };

  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(3),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  'CMS:Community': 'CMS:社区',
  Post2: '帖子',
  'Create Post': '新建帖子',
  'Post List': '帖子列表',
  'Post List(by category)': '帖子列表(按目录)',
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(7);
const post = __webpack_require__(8);
const event = __webpack_require__(9);

const middlewareWrite = async function(ctx, next) {
  // validator
  const validator = await ctx.meta.atom.validator({
    atomClass: ctx.request.body.atomClass,
    user: ctx.user.op,
  });
  // validate options
  ctx.meta.middlewares.validate = {
    module: validator.module,
    validator: validator.validator,
    data: 'item',
  };
  await next();
};

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // post
    { method: 'post', path: 'post/create', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/read', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/select', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/write', controller: post, middlewares: [ 'inner', middlewareWrite, 'validate' ],
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'post/delete', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/action', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/enable', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    // event
    { method: 'post', path: 'event/atomClassValidator', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

    async init() {
      await this.service.version.init(this.ctx.request.body);
      this.ctx.success();
    }

    async test() {
      await this.service.version.test(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = app => {

  class PostController extends app.Controller {

    async create() {
      const res = await this.ctx.service.post.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.post.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.post.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.post.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.post.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.post.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.post.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return PostController;
};



/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {

  class EventController extends app.Controller {

    async atomClassValidator() {
      const res = await this.ctx.service.event.atomClassValidator({
        event: this.ctx.request.body.event,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

  }

  return EventController;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const post = __webpack_require__(12);
const event = __webpack_require__(14);

module.exports = app => {
  const services = {
    version,
    post,
    event,
  };
  return services;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-community-writer to template
        const roles = [ 'cms-community-writer', 'cms-community-publisher' ];
        const roleTemplate = await this.ctx.meta.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.meta.role.getSystemRole({ roleName: 'superuser' });
        const roleActivated = await this.ctx.meta.role.getSystemRole({ roleName: 'activated' });
        for (const roleName of roles) {
          const roleId = await this.ctx.meta.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-community
          await this.ctx.meta.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
          // role:activated include cms-community-writer
          if (roleName === 'cms-community-writer') {
            await this.ctx.meta.role.addRoleInc({ roleId: roleActivated.id, roleIdInc: roleId });
          }
        }
        // build roles
        await this.ctx.meta.role.build();

        // add role rights
        const roleRights = [
          { roleName: 'cms-community-writer', action: 'create' },
          { roleName: 'cms-community-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-community-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-community-publisher', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-community-publisher', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'cms-community-publisher', action: 'publish', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
        ];
        const module = this.ctx.app.meta.modules[this.ctx.module.info.relativeName];
        const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'post' });
        for (const roleRight of roleRights) {
          // role
          const role = await this.ctx.meta.role.get({ roleName: roleRight.roleName });
          // scope
          let scope;
          if (!roleRight.scopeNames) {
            scope = 0;
          } else {
            const roleScope = await this.ctx.meta.role.get({ roleName: roleRight.scopeNames });
            scope = [ roleScope.id ];
          }
          // add role right
          await this.ctx.meta.role.addRoleRight({
            roleId: role.id,
            atomClassId: atomClass.id,
            action: this.ctx.constant.module('a-base').atom.action[roleRight.action] || module.main.meta.base.atoms.post
              .actions[roleRight.action].code,
            scope,
          });
        }

      }
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(13);
const mparse = require3('egg-born-mparse').default;

module.exports = app => {
  // this module
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // article module
  const articleModuleInfo = mparse.parseInfo('a-cms');
  const articleAtomClassName = 'article';

  class Post extends app.Service {

    async create({ atomClass, key, item, user }) {
      // route to article
      const itemKey = await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/create`,
        body: {
          atomClass,
          key,
          item,
          user,
        },
      });
      // return key
      return itemKey;
    }

    async read({ atomClass, key, item, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/read`,
        body: {
          atomClass,
          key,
          item,
          user,
        },
      });
    }

    async select({ atomClass, options, items, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/select`,
        body: {
          atomClass,
          options,
          items,
          user,
        },
      });
    }

    async write({ atomClass, key, item, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/writeNoValidate`,
        body: {
          atomClass,
          key,
          item,
          user,
        },
      });
    }

    async delete({ atomClass, key, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/delete`,
        body: {
          atomClass,
          key,
          user,
        },
      });
    }

    async action({ action, atomClass, key, user }) {
      // route to article
      return await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/action`,
        body: {
          action,
          atomClass,
          key,
          user,
        },
      });
    }

    async enable({ atomClass, key, atom, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/enable`,
        body: {
          atomClass,
          key,
          atom,
          user,
        },
      });
    }

  }

  return Post;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Event extends app.Service {

    async atomClassValidator({ event, data: { atomClass, user } }) {
      if (atomClass.module === moduleInfo.relativeName && atomClass.atomClassName === 'post') {
        // check if in role:cms-community-publisher
        const rolePublisher = await this.ctx.meta.role.get({ roleName: 'cms-community-publisher' });
        const check = await this.ctx.meta.role.userInRoleExpand({ userId: user.id, roleId: rolePublisher.id });
        if (!check) return null;
        // break event
        event.break = true;
        // more fields
        const validator = {
          module: 'a-cms',
          validator: 'article',
        };
        return validator;
      }
    }

  }

  return Event;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const post = __webpack_require__(16);

module.exports = app => {
  const models = {
    post,
  };
  return models;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {
  class Post extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticle', options: { disableDeleted: false } });
    }
  }
  return Post;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'post',
  };
  const atomClassQuery = `module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`;
  const schemas = __webpack_require__(18)(app);
  const meta = {
    base: {
      atoms: {
        post: {
          info: {
            title: 'Post2',
            tableName: 'aCmsArticleView',
            tableNameFull: 'aCmsArticleViewFull',
            tableNameSearch: 'aCmsArticleViewSearch',
            tableNameTag: 'aCmsArticleViewTag',
            flow: 1,
          },
          actions: {
            publish: {
              code: 101,
              title: 'Publish',
              flag: '1,2',
            },
          },
          flags: {
            1: {
              title: 'Publishing',
            },
            2: {
              title: 'Published',
            },
          },
          validator: 'post',
          search: {
            validator: 'postSearch',
          },
        },
      },
      functions: {
        createPost: {
          title: 'Create Post',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'post',
          action: 'create',
          sorting: 2,
          menu: 1,
        },
        listPost: {
          title: 'Post List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 2,
          menu: 1,
        },
        listPostByCategory: {
          title: 'Post List(by category)',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 2,
          menu: 1,
          actionPath: `/a/cms/article/category?${atomClassQuery}`,
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
    settings: {
      instance: {
        actionPath: `/a/cms/config/list?${atomClassQuery}`,
      },
    },
    event: {
      implementations: {
        'a-base:atomClassValidator': 'event/atomClassValidator',
      },
    },
  };
  return meta;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // post
  schemas.post = {
    type: 'object',
    meta: {
      custom: {
        component: 'postItem',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebMultiple: false,
        ebOptionsBlankAuto: true,
        notEmpty: true,
      },
      categoryId: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Category',
        notEmpty: true,
      },
      tags: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Tags',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };
  // post search
  schemas.postSearch = {
    type: 'object',
    meta: {
      custom: {
        component: 'postSearch',
      },
    },
    properties: {
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebMultiple: false,
        ebOptionsBlankAuto: true,
      },
      categoryId: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Category',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map