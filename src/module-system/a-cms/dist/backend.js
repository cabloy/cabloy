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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(3);
const locales = __webpack_require__(4);
const errors = __webpack_require__(7);
const middlewares = __webpack_require__(8);

module.exports = app => {

  // routes
  const routes = __webpack_require__(9)(app);
  // services
  const services = __webpack_require__(16)(app);
  // models
  const models = __webpack_require__(24)(app);
  // meta
  const meta = __webpack_require__(28)(app);

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
/* 3 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
    publishOnSubmit: true,
  };

  // site
  config.site = {
    base: {
      title: 'my blog',
      subTitle: 'gone with the wind',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://example.com',
      rootPath: '',
    },
    language: {
      default: 'en-us',
      items: 'en-us',
    },
    themes: {
      'en-us': 'cms-themeblog',
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
    },
    profile: {
      userName: 'zhennann',
      motto: 'Less is more, while more is less.',
      avatar: 'assets/images/avatar.jpg',
      avatarUrl: 'index.html',
    },
  };

  //
  return config;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(5),
  'zh-cn': __webpack_require__(6),
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
  'en-us': 'English',
  'zh-cn': 'Chinese',
  PersonalProfile: 'Profile',
  ArticlePrevious: 'Previous',
  ArticleNext: 'Next',
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
  Article: '文章',
  Catalog: '目录',
  Comments: '评论',
  Language: '语言',
  Publish: '发布',
  Publishing: '发布中',
  Published: '已发布',
  Search: '搜索',
  Submit: '提交',
  Sorting: '排序',
  'Are you sure?': '您确认吗？',
  'Article List': '文章清单',
  'Article List(by category)': '文章清单(按目录)',
  'Category name': '目录名称',
  'Comment Disabled': '禁止评论',
  'Create Article': '新建文章',
  'Language must not be empty': '语言不允许为空',
  'Load More': '加载更多',
  'Post Comment': '发表评论',
  'Recent Comments': '最近评论',
  'Theme not set': '没有设置主题',
  'Theme not found': '没有找到主题',
  'en-us': '英语',
  'zh-cn': '简体中文',
  PersonalProfile: '个人信息',
  ArticlePrevious: '前一篇',
  ArticleNext: '后一篇',
  Yes: '是',
  No: '否',
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Language must not be empty',
  1002: 'Theme not set',
  1003: 'Theme not found',
  1004: 'Cannot delete if has children',
  1005: 'Cannot delete if has articles',
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(10);
const article = __webpack_require__(11);
const category = __webpack_require__(12);
const render = __webpack_require__(13);
const site = __webpack_require__(14);
const comment = __webpack_require__(15);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // article
    { method: 'post', path: 'article/create', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/read', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/select', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/write', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/delete', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/action', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/enable', controller: article, middlewares: 'inner' },
    { method: 'get', path: 'article/list', controller: article, middlewares: 'jsonp' },
    { method: 'get', path: 'article/attachments', controller: article, middlewares: 'jsonp' },
    // comment
    { method: 'get', path: 'comment/all', controller: comment, action: 'allP', middlewares: 'jsonp' },
    // render
    { method: 'post', path: 'render/renderArticle', controller: render, middlewares: 'inner,file' },
    { method: 'post', path: 'render/deleteArticle', controller: render, middlewares: 'inner,file' },
    { method: 'post', path: 'render/getArticleUrl', controller: render,
      meta: { right: { type: 'atom', action: 2 } },
    },
    // site
    { method: 'post', path: 'site/getConfigSiteBase', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigSite', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigSite', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguagePreview', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguage', controller: site, middlewares: 'file', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguages', controller: site, middlewares: 'file', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getLanguages', controller: site },
    { method: 'post', path: 'site/getUrl', controller: site },
    // category
    { method: 'post', path: 'category/item', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/save', controller: category, middlewares: 'validate', meta: {
      validate: { validator: 'category' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    } },
    { method: 'post', path: 'category/children', controller: category }, // not set function right
    { method: 'post', path: 'category/add', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/delete', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/move', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },

  ];
  return routes;
};


/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class ArticleController extends app.Controller {

    async create() {
      const res = await this.ctx.service.article.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.article.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.article.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.article.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.article.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.article.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.article.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

    // list
    async list() {
      // options
      const options = JSON.parse(this.ctx.request.query.options);
      // filter drafts
      options.where = extend(true, options.where, {
        'a.atomEnabled': 1,
        'a.atomFlag': 2,
      });
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/atom/select',
        body: {
          atomClass: {
            module: 'a-cms',
            atomClassName: 'article',
          },
          options,
        },
      });
      this.ctx.success(res);
    }

    // attachments
    async attachments() {
      // data
      const data = JSON.parse(this.ctx.request.query.data);
      // options
      const options = data.options || {};
      // filter drafts
      options.where = extend(true, options.where, {
        mode: 2,
        attachment: 1,
      });
      if (!options.orders) {
        options.orders = [
          [ 'realName', 'asc' ],
        ];
      }
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/file/file/list',
        body: {
          key: data.key,
          options,
        },
      });
      this.ctx.success(res);
    }

  }
  return ArticleController;
};



/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class CategoryController extends app.Controller {

    async item() {
      const data = await this.ctx.service.category.item({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(data);
    }

    async save() {
      const res = await this.ctx.service.category.save({
        categoryId: this.ctx.request.body.categoryId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async children() {
      const list = await this.ctx.service.category.children({
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success({ list });
    }

    async add() {
      const res = await this.ctx.service.category.add(this.ctx.request.body.data);
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.category.delete({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

    async move() {
      const res = await this.ctx.service.category.move({
        categoryId: this.ctx.request.body.categoryId,
        categoryIdParent: this.ctx.request.body.categoryIdParent,
      });
      this.ctx.success(res);
    }

  }
  return CategoryController;
};



/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class RenderController extends app.Controller {

    async renderArticle() {
      const res = await this.ctx.service.render.renderArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

    async deleteArticle() {
      const res = await this.ctx.service.render.deleteArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

    async getArticleUrl() {
      const res = await this.ctx.service.render.getArticleUrl(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return RenderController;
};



/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class SiteController extends app.Controller {

    async getConfigSiteBase() {
      const data = await this.ctx.service.site.getConfigSiteBase();
      this.ctx.success({ data });
    }

    async getConfigSite() {
      const data = await this.ctx.service.site.getConfigSite();
      this.ctx.success({ data });
    }

    async setConfigSite() {
      const res = await this.ctx.service.site.setConfigSite({
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async getConfigLanguagePreview() {
      const data = await this.ctx.service.site.getConfigLanguagePreview({
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async getConfigLanguage() {
      const data = await this.ctx.service.site.getConfigLanguage({
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async setConfigLanguage() {
      const res = await this.ctx.service.site.setConfigLanguage({
        language: this.ctx.request.body.language,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async buildLanguage() {
      const res = await this.ctx.service.site.buildLanguage({
        language: this.ctx.request.body.language,
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      const res = await this.ctx.service.site.buildLanguages();
      this.ctx.success(res);
    }

    async getLanguages() {
      const res = await this.ctx.service.site.getLanguages();
      this.ctx.success(res);
    }

    async getUrl() {
      const res = await this.ctx.service.site.getUrl({
        language: this.ctx.request.body.language,
        path: this.ctx.request.body.path,
      });
      this.ctx.success(res);
    }

  }
  return SiteController;
};



/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class CommentController extends app.Controller {

    async allP() {
      // options
      const options = JSON.parse(this.ctx.request.query.options);
      // filter drafts
      options.where = extend(true, options.where, {
        'a.atomEnabled': 1,
        'a.atomFlag': 2,
      });
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/comment/all',
        body: {
          atomClass: {
            module: 'a-cms',
            atomClassName: 'article',
          },
          options,
        },
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(17);
const article = __webpack_require__(18);
const category = __webpack_require__(19);
const render = __webpack_require__(20);
const site = __webpack_require__(23);

module.exports = app => {
  const services = {
    version,
    article,
    category,
    render,
    site,
  };
  return services;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aCmsArticle
        let sql = `
          CREATE TABLE aCmsArticle (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            categoryId int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            sticky int(11) DEFAULT '0',
            keywords varchar(255) DEFAULT NULL,
            description text DEFAULT NULL,
            summary text DEFAULT NULL,
            url varchar(255) DEFAULT NULL,
            editMode int(11) DEFAULT '0',
            slug varchar(255) DEFAULT NULL,
            sorting int(11) DEFAULT '0',
            flag varchar(255) DEFAULT NULL,
            extra json DEFAULT NULL,
            imageFirst varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aCmsContent
        sql = `
          CREATE TABLE aCmsContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content text DEFAULT NULL,
            html text DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aCmsCategory
        sql = `
          CREATE TABLE aCmsCategory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            categoryName varchar(50) DEFAULT NULL,
            language varchar(50) DEFAULT NULL,
            catalog int(11) DEFAULT '0',
            hidden int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            flag varchar(255) DEFAULT NULL,
            categoryIdParent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aCmsArticleView
        sql = `
          CREATE VIEW aCmsArticleView as
            select a.*,b.categoryName from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
        `;
        await this.ctx.model.query(sql);

        // create view: aCmsArticleViewFull
        sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.categoryName,c.content,c.html,concat(d.atomName,',',c.content) contentSearch from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aAtom d on a.atomId=d.id
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-writer cms-publisher
        const roles = [ 'cms-writer', 'cms-publisher' ];
        const roleAuthenticated = await this.ctx.meta.role.getSystemRole({ roleName: 'authenticated' });
        const userRoot = await this.ctx.meta.user.get({ userName: 'root' });
        for (const roleName of roles) {
          const roleId = await this.ctx.meta.role.add({
            roleName,
            roleIdParent: roleAuthenticated.id,
          });
          // add user to role
          await this.ctx.meta.role.addUserRole({
            userId: userRoot.id,
            roleId,
          });
        }
        // build roles
        await this.ctx.meta.role.build();

        // add role rights
        const roleRights = [
          { roleName: 'cms-writer', action: 'create' },
          { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'read', scopeNames: 'cms-writer' },
          { roleName: 'cms-publisher', action: 'read', scopeNames: 'cms-writer' },
          { roleName: 'cms-publisher', action: 'write', scopeNames: 'cms-writer' },
          { roleName: 'cms-publisher', action: 'publish', scopeNames: 'cms-writer' },
          { roleName: 'root', action: 'read', scopeNames: 'cms-writer' },
        ];
        const module = this.ctx.app.meta.modules[this.ctx.module.info.relativeName];
        const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'article' });
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
            action: this.ctx.constant.module('a-base').atom.action[roleRight.action] || module.main.meta.base.atoms.article
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const trimHtml = require3('trim-html');
const markdown = require3('@zhennann/markdown');

module.exports = app => {

  class Article extends app.Service {

    async create({ atomClass, key, atom, user }) {
      const site = await this.ctx.service.render.combineSiteBase();
      const editMode = site.edit.mode;
      // add article
      const res = await this.ctx.model.article.insert({
        atomId: key.atomId,
        editMode,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.content.insert({
        atomId: key.atomId,
        itemId,
        content: '',
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, key, item, user }) {
      // read
    }

    async select({ atomClass, options, items, user }) {
      // select
    }

    async write({ atomClass, key, item, validation, user }) {
      // image first
      let imageFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/!\[[^\]]*?\]\(([^\)]*?)\)/);
        imageFirst = (matches && matches[1]) || '';
      }
      // markdown
      const md = markdown.create();
      let html;
      // html
      if (item.editMode === 1) {
        html = item.content ? md.render(item.content) : '';
      } else {
        html = item.content;
      }
      // summary
      const summary = trimHtml(html, this.ctx.config.article.trim);
      // update article
      await this.ctx.model.article.update({
        id: key.itemId,
        language: item.language,
        categoryId: item.categoryId,
        sticky: item.sticky,
        keywords: item.keywords,
        description: item.description,
        summary: summary.html,
        editMode: item.editMode,
        slug: item.slug,
        sorting: item.sorting,
        flag: item.flag,
        extra: item.extra || '{}',
        imageFirst,
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?',
        [ item.content, html, this.ctx.instance.id, key.atomId ]);
      // get atom for safety
      const atom = await this.ctx.meta.atom.get(key);
      // render
      await this._renderArticle({ key, inner: atom.atomFlag !== 2 });
    }

    async delete({ atomClass, key, user }) {
      // delete article
      await this.ctx.performAction({
        method: 'post',
        url: 'render/deleteArticle',
        body: { key },
      });
      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.query('delete from aCmsContent where iid=? and atomId=?',
        [ this.ctx.instance.id, key.atomId ]);
    }

    async action({ action, atomClass, key, user }) {
      if (action === 101) {
        // change flag
        await this.ctx.meta.atom.flag({
          key,
          atom: { atomFlag: 2 },
          user,
        });
        // change flow
        await this.ctx.meta.atom.flow({
          key,
          atom: { atomFlow: 0 },
          user,
        });
        // render
        await this._renderArticle({ key, inner: false });
      }
    }

    async enable({ atomClass, key, atom, user }) {
      // enable
      const atomFlag = atom.atomEnabled ? 1 : 0;
      // change flag
      await this.ctx.meta.atom.flag({
        key,
        atom: { atomFlag },
        user,
      });
      if (this.ctx.config.article.publishOnSubmit) {
        // publish
        await this.action({ action: 101, key, user });
      }
    }

    async _renderArticle({ key, inner }) {
      await this.ctx.performAction({
        method: 'post',
        url: 'render/renderArticle',
        body: { key, inner },
      });
    }

  }

  return Article;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {

  class Category extends app.Service {

    async item({ categoryId }) {
      return await this.ctx.model.category.get({ id: categoryId });
    }

    async save({ categoryId, data }) {
      await this.ctx.model.category.update({
        id: categoryId,
        categoryName: data.categoryName,
        hidden: data.hidden,
        sorting: data.sorting,
        flag: data.flag,
      });
    }

    async children({ language, categoryId, hidden, flag }) {
      const where = {
        categoryIdParent: categoryId || 0,
      };
      if (language !== undefined) where.language = language;
      if (hidden !== undefined) where.hidden = hidden;
      if (flag !== undefined) where.flag = flag;
      const list = await this.ctx.model.category.select({
        where,
        orders: [[ 'sorting', 'asc' ], [ 'createdAt', 'asc' ]],
      });
      return list;
    }

    async add({ categoryName, language, categoryIdParent }) {
      // add
      const res = await this.ctx.model.category.insert({
        categoryName,
        language,
        catalog: 0,
        hidden: 0,
        sorting: 0,
        categoryIdParent,
      });
      // adjust catalog
      await this.adjustCatalog(categoryIdParent);

      return res.insertId;
    }

    async delete({ categoryId }) {
      // check articles
      const list = await this.ctx.model.article.select({ where: { categoryId } });
      if (list.length > 0) this.ctx.throw(1005);
      // check children
      const children = await this.children({ categoryId });
      if (children.length > 0) this.ctx.throw(1004);
      // category
      const category = await this.ctx.model.category.get({ id: categoryId });
      // parent
      const categoryIdParent = category.categoryIdParent;
      // delete
      await this.ctx.model.category.delete({ id: categoryId });
      // adjust catalog
      await this.adjustCatalog(categoryIdParent);
    }

    async move({ categoryId, categoryIdParent }) {
      // category
      const category = await this.ctx.model.category.get({ id: categoryId });
      // categoryIdParentOld
      const categoryIdParentOld = category.categoryIdParent;
      // move
      await this.ctx.model.category.update({
        id: categoryId,
        categoryIdParent,
      });
      // adjust catalog
      await this.adjustCatalog(categoryIdParentOld);
      await this.adjustCatalog(categoryIdParent);
    }

    async adjustCatalog(categoryId) {
      if (categoryId === 0) return;
      const children = await this.children({ categoryId });
      await this.ctx.model.category.update({
        id: categoryId,
        catalog: children.length === 0 ? 0 : 1,
      });
    }

    async tree({ language, categoryId, hidden, flag }) {
      return await this._treeChildren({ language, categoryId, hidden, flag });
    }

    async _treeChildren({ language, categoryId, hidden, flag }) {
      const list = await this.children({ language, categoryId, hidden, flag });
      for (const item of list) {
        if (item.catalog) {
          // only categoryId
          item.children = await this._treeChildren({ categoryId: item.id });
        }
      }
      return list;
    }

  }

  return Category;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(1);
const require3 = __webpack_require__(0);
const ejs = require3('@zhennann/ejs');
const pMap = require3('p-map');
const extend = require3('extend2');
const uuid = require3('uuid');
const fse = require3('fs-extra');
const moment = require3('moment');
const glob = require3('glob');
const bb = require3('bluebird');
const CleanCSS = require3('clean-css');
const shajs = require3('sha.js');
const babel = require3('babel-core');
const UglifyJS = require3('uglify-js');
const time = __webpack_require__(21);

module.exports = app => {

  class Render extends app.Service {

    async renderAllFiles({ language }) {
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language });
      // render static
      await this._renderStatic({ site });
      // render articles
      await this._renderArticles({ site });
      // render index
      await this._renderIndex({ site });
    }

    async renderArticle({ key, inner }) {
      // article
      const article = await this._getArticle({ key, inner });
      if (!article) return;
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language: article.language });
      // render article
      await this._renderArticle({ site, article });
      if (!inner) {
        // write sitemap
        await this._writeSitemap({ site, article });
        // render index
        await this._renderIndex({ site });
      }
    }

    async deleteArticle({ key }) {
      // article
      const article = await this._getArticle({ key, inner: true });
      if (!article) return;
      // site
      const site = await this.getSite({ language: article.language });
      // remove file
      const pathDist = await this.getPathDist(site, article.language);
      await fse.remove(path.join(pathDist, article.url));
      // remove sitemap
      let xml = await fse.readFile(path.join(pathDist, 'sitemap.xml'));
      const regexp = new RegExp(` {2}<url>\\s+<loc>[^<]*${article.url}[^<]*</loc>[\\s\\S]*?</url>[\\r\\n]`);
      xml = xml.toString().replace(regexp, '');
      // save
      await fse.writeFile(path.join(pathDist, 'sitemap.xml'), xml);
    }

    async getArticleUrl({ key }) {
      // article
      const article = await this._getArticle({ key, inner: true });
      if (!article) return;
      // site
      const site = await this.getSite({ language: article.language });
      // url
      return {
        relativeUrl: article.url,
        url: this.getUrl(site, site.language.current, article.url),
      };
    }

    async _getArticle({ key, inner }) {
      if (!inner) {
        // check right
        const roleAnonymous = await this.ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
        const right = await this.ctx.meta.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return null;
      }
      // article
      const article = await this.ctx.meta.atom.read({ key, user: { id: 0 } });
      if (!article) return null;
      // check language
      if (!article.language) this.ctx.throw(1001);
      return article;
    }

    async _renderArticles({ site }) {
      // anonymous user
      let userId;
      const user = await this.ctx.meta.user.get({ anonymous: true });
      if (user) {
        userId = user.id;
      } else {
        userId = await this.ctx.meta.user.anonymous();
      }
      // articles
      const articles = await this.ctx.meta.atom.select({
        atomClass: { module: 'a-cms', atomClassName: 'article' },
        options: {
          where: {
            'a.atomFlag': 2,
            'f.language': site.language.current,
          },
          orders: [[ 'a.updatedAt', 'desc' ]],
          page: null,
          mode: 'search',
        },
        user: { id: userId },
        pageForce: false,
      });
      // concurrency
      const mapper = article => {
        // render article
        return this._renderArticle({ site, article });
      };
      await pMap(articles, mapper, { concurrency: 10 });
      // write sitemap
      await this._writeSitemaps({ site, articles });
    }

    async _renderStatic({ site }) {
      // static
      const pathIntermediate = await this.getPathIntermediate(site.language.current);
      const staticFiles = await bb.fromCallback(cb => {
        glob(`${pathIntermediate}/static/\*\*/\*.ejs`, cb);
      });
      for (const item of staticFiles) {
        // data
        const data = await this.getData({ site });
        // path
        const _fileSrc = item.substr(pathIntermediate.length + 1);
        await this._renderFile({
          fileSrc: _fileSrc,
          fileDest: _fileSrc.replace('.ejs', '.html'),
          data,
        });
      }
    }

    async _renderIndex({ site }) {
      // index
      const pathIntermediate = await this.getPathIntermediate(site.language.current);
      const indexFiles = await bb.fromCallback(cb => {
        glob(`${pathIntermediate}/main/index/\*\*/\*.ejs`, cb);
      });
      for (const item of indexFiles) {
        // data
        const data = await this.getData({ site });
        // path
        const _fileSrc = item.substr(pathIntermediate.length + 1);
        const _fileDest = _fileSrc.substr('main/index/'.length).replace('.ejs', '.html');
        await this._renderFile({
          fileSrc: _fileSrc,
          fileDest: _fileDest,
          data,
        });
      }
    }

    async _writeSitemap({ site, article }) {
      const loc = this.getUrl(site, site.language.current, article.url);
      const lastmod = moment(article.updatedAt).format();
      // load
      const pathDist = await this.getPathDist(site, site.language.current);
      const fileName = path.join(pathDist, 'sitemap.xml');
      let xml;
      const exists = await fse.pathExists(fileName);
      if (!exists) {
        xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>`;
      } else {
        xml = await fse.readFile(fileName);
        xml = xml.toString();
        // remove
        const regexp = new RegExp(` {2}<url>\\s+<loc>[^<]*${article.url}[^<]*</loc>[\\s\\S]*?</url>[\\r\\n]`);
        xml = xml.replace(regexp, '');
        // append
        xml = xml.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`);
      }
      // save
      await fse.writeFile(fileName, xml);
    }

    async _writeSitemaps({ site, articles }) {
      // xml
      let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      for (const article of articles) {
        const loc = this.getUrl(site, site.language.current, article.url);
        const lastmod = moment(article.updatedAt).format();
        xml +=
`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
`;
      }
      xml += '</urlset>';
      // save
      const pathDist = await this.getPathDist(site, site.language.current);
      const fileName = path.join(pathDist, 'sitemap.xml');
      await fse.writeFile(fileName, xml);
    }

    async _renderArticle({ site, article }) {
      // data
      const data = await this.getData({ site });
      data.article = article;
      // url
      let url;
      if (article.slug) {
        url = `articles/${article.slug}.html`;
      } else {
        url = article.url || `articles/${uuid.v4().replace(/-/g, '')}.html`;
      }
      await this._renderFile({
        fileSrc: 'main/article.ejs',
        fileDest: url,
        data,
      });
      // save
      await this.ctx.model.article.update({
        id: article.id,
        url,
      });
      article.url = url;
    }

    async _renderFile({ fileSrc, fileDest, data }) {
      // site
      const site = data.site;
      // language
      const language = site.language.current;
      // src
      const pathIntermediate = await this.getPathIntermediate(language);
      const fileName = path.join(pathIntermediate, fileSrc);
      // data
      data._filename = fileName;
      data._path = fileSrc.replace('.ejs', '');
      // env site
      data.env('site', {
        path: data._path,
        serverUrl: site.serverUrl,
        rawRootUrl: this.getUrlRawRoot(site),
      });
      // render
      let content = await ejs.renderFile(fileName, data, this.getOptions());
      content = await this._renderEnvs({ data, content });
      content = await this._renderCSSJSes({ data, content });
      // dest
      const pathDist = await this.getPathDist(site, language);
      const fileWrite = path.join(pathDist, fileDest);
      // write
      await fse.outputFile(fileWrite, content);
    }

    async _renderCSSJSes({ data, content }) {
      content = await this._renderCSSJS({ data, content, type: 'CSS', items: data._csses });
      content = await this._renderCSSJS({ data, content, type: 'JS', items: data._jses });
      return content;
    }

    async _renderCSSJS({ data, content, type, items }) {
      if (items.length === 0) return content;
      // site
      const site = data.site;
      // cache
      if (!site._cache) site._cache = {};
      if (!site._cache[type])site._cache[type] = {};
      const cacheSha = shajs('sha256').update(items.join(',')).digest('hex');
      let urlDest;
      if (site._cache[type][cacheSha]) {
        urlDest = site._cache[type][cacheSha];
      } else {
        // combine
        let result = '';
        for (const item of items) {
          let _content;
          if (path.extname(item) === '.ejs') {
            // data
            data._filename = item;
            _content = await ejs.renderFile(item, data, this.getOptions());
          } else {
            _content = await fse.readFile(item);
          }
          // minify
          if (type === 'CSS') {
            if (item.indexOf('.min.css') === -1) {
              const output = new CleanCSS().minify(_content);
              _content = output.styles;
            }
          } else {
            if (item.indexOf('.min.js') === -1) {
              _content = babel.transform(_content, { ast: false, babelrc: false, presets: [ 'env' ] }).code;
              const output = UglifyJS.minify(_content);
              if (output.error) throw new Error(`${output.error.name}: ${output.error.message}`);
              _content = output.code;
            }
          }
          // append
          result += _content + '\n';
        }
        // save
        const sha = shajs('sha256').update(result).digest('hex');
        // dest
        const fileDest = `assets/${type.toLowerCase()}/${sha}.${type.toLowerCase()}`;
        const pathDist = await this.getPathDist(site, site.language.current);
        const fileWrite = path.join(pathDist, fileDest);
        // write
        await fse.outputFile(fileWrite, result);
        // url
        urlDest = this.getUrl(site, site.language.current, fileDest);
        // cache
        site._cache[type][cacheSha] = urlDest;
      }
      // replace
      const regexp = new RegExp(`__${type}__`);
      return content.replace(regexp, urlDest);
    }

    async _renderEnvs({ data, content }) {
      // site
      const site = data.site;
      // env
      const _env = {};
      for (const name of Object.keys(data._envs)) {
        let value;
        const keys = name.split('.');
        for (let index = keys.length - 1; index >= 0; index--) {
          const key = keys[index];
          value = value ? { [key]: value } : { [key]: data._envs[name] };
        }
        extend(true, _env, value);
      }
      // combine
      const env = extend(true, {
        base: site.base,
        language: site.language,
      }, site.env, _env);
      if (data.article) {
        env.article = extend(true, {}, data.article);
        delete env.article.summary;
        delete env.article.content;
        delete env.article.html;
        delete env.article.contentSearch;
      }
      // replace
      const text = `
<script type="text/javascript">
var env=${JSON.stringify(env, null, 2)};
</script>
`;
      const regexp = new RegExp('__ENV__');
      return content.replace(regexp, text);
    }

    async getPathCustom(language) {
      const cms = await this.getPathCms();
      return path.join(cms, language, 'custom');
    }
    async getPathIntermediate(language) {
      const cms = await this.getPathCms();
      return path.join(cms, language, 'intermediate');
    }
    async getPathDist(site, language) {
      const rawDist = await this.getPathRawDist();
      return path.join(rawDist, language === site.language.default ? '' : '/' + language);
    }
    async getPathCms() {
      return await this.ctx.meta.file.getPath('cms');
    }
    async getPathRawDist() {
      return await this.ctx.meta.file.getPath('cms/dist');
    }

    getUrlRawRoot(site) {
      if (this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal) {
        const publicDir = this.ctx.app.config.static.prefix;
        const prefix = this.ctx.host ? `${this.ctx.protocol}://${this.ctx.host}` : '';
        return `${prefix}${publicDir}${this.ctx.instance.id}/cms/dist`;
      }
      return `${site.host.url}${site.host.rootPath ? '/' + site.host.rootPath : ''}`;
    }
    getUrlRoot(site, language) {
      const rawRoot = this.getUrlRawRoot(site);
      return `${rawRoot}${language === site.language.default ? '' : '/' + language}`;
    }
    getUrl(site, language, path) {
      const urlRoot = this.getUrlRoot(site, language);
      return path ? `${urlRoot}/${path}` : urlRoot;
    }
    getServerUrl(path) {
      return this.ctx.meta.file.getUrl(path);
    }

    async getData({ site }) {
      // categories
      if (!site.categories) {
        site.categories = await this.ctx.service.category.tree({ language: site.language.current, hidden: 0 });
      }
      // languages
      if (!site.languages) {
        site.languages = [];
        for (const item of site.language.items.split(',')) {
          site.languages.push({
            name: item,
            title: this.ctx.text.locale(item, item),
            url: this.getUrl(site, item, ''),
          });
        }
      }
      // server url
      if (!site.serverUrl) {
        site.serverUrl = this.getServerUrl('');
      }
      // data
      const self = this;
      const _csses = [];
      const _jses = [];
      const _envs = {};
      let _pathIntermediate = await this.getPathIntermediate(site.language.current);
      _pathIntermediate = path.join(_pathIntermediate, '/');
      return {
        ctx: self.ctx,
        site,
        _csses,
        _jses,
        _envs,
        require(fileName) {
          const _path = self.resolvePath('', this._filename, fileName);
          return __webpack_require__(22)(_path);
        },
        url(fileName, language) {
          let _path = self.resolvePath('', path.relative(_pathIntermediate, this._filename), fileName);
          _path = _path.replace(/\\/gi, '/');
          return self.getUrl(site, language || site.language.current, _path);
        },
        css(fileName) {
          _csses.push(self.resolvePath(_pathIntermediate, this._filename, fileName));
        },
        js(fileName) {
          _jses.push(self.resolvePath(_pathIntermediate, this._filename, fileName));
        },
        env(name, value) {
          _envs[name] = value;
        },
        text(str) {
          return this.ctx.text.locale(site.language.current, str);
        },
        util: {
          time,
          formatDateTime(date) {
            return this.time.formatDateTime(date, `${site.env.format.date} ${site.env.format.time}`);
          },
        },
      };
    }

    resolvePath(pathRoot, fileCurrent, fileName) {
      if (!fileName) return pathRoot;
      if (fileName.charAt(0) === '.') return path.join(path.dirname(fileCurrent), fileName); // not use path.resolve
      return path.join(pathRoot, fileName);
    }

    getOptions() {
      return {
        async: true,
        cache: true,
        compileDebug: this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal,
        outputFunctionName: 'echo',
      };
    }

    // site<plugin<theme<site(db)<language(db)
    async getSite({ language }) {
      const siteBase = await this.combineSiteBase();
      return await this.combineSite({ siteBase, language });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase() {
      // site
      const site = await this.ctx.service.site.getConfigSiteBase();
      // site(db) special for language/themes
      const configSite = await this.ctx.service.site.getConfigSite();
      if (configSite && configSite.language) site.language = configSite.language;
      if (configSite && configSite.themes) site.themes = configSite.themes;
      return site;
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSite({ siteBase, language }) {
      // themeModuleName
      const themeModuleName = siteBase.themes[language];
      if (!themeModuleName) this.ctx.throw(1002);
      // theme
      const theme = this.ctx.config.module(themeModuleName).theme;
      // site(db)
      const configSite = await this.ctx.service.site.getConfigSite();
      // language(db)
      const configLanguage = await this.ctx.service.site.getConfigLanguage({ language });
      // combine
      return extend(true, {},
        siteBase, theme, configSite, configLanguage,
        { language: { current: language } }
      );
    }

  }

  return Render;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

const _formatDateTime = function(date, fmt) { // original author: meizz
  const o = {
    'M+': date.getMonth() + 1, // month
    'D+': date.getDate(), // day
    'H+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'Q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // millisecond
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  return fmt;
};

module.exports = {
  now() {
    return this.formatDateTime(null);
  },
  today() {
    return this.formatDate(null);
  },
  formatDateTime(date, fmt) {
    date = date || new Date();
    if (typeof (date) !== 'object') date = new Date(date);
    fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
    return _formatDateTime(date, fmt);
  },
  formatDate(date, sep) {
    sep = sep || '-';
    return this.formatDateTime(date, `YYYY${sep}MM${sep}DD`);
  },
  formatTime(date, sep) {
    sep = sep || ':';
    return this.formatDateTime(date, `HH${sep}mm${sep}ss`);
  },
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 22;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(1);
const require3 = __webpack_require__(0);
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');
const extend = require3('extend2');

module.exports = app => {

  class Site extends app.Service {

    async getConfigSiteBase() {
      // site
      const site = extend(true, {}, this.ctx.config.site);
      // plugins
      site.plugins = {};
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.plugin) {
          site.plugins[relativeName] = this.ctx.config.module(relativeName).plugin;
        }
      }
      return site;
    }

    async getConfigSite() {
      return await this.ctx.meta.status.get('config-site');
    }

    async setConfigSite({ data }) {
      await this.ctx.meta.status.set('config-site', data);
    }

    async getConfigLanguagePreview({ language }) {
      const site = await this.ctx.service.render.getSite({ language });
      this._adjustConfigLanguange(site);
      return site;
    }

    async getConfigLanguage({ language }) {
      return await this.ctx.meta.status.get(`config-${language}`);
    }

    async setConfigLanguage({ language, data }) {
      this._adjustConfigLanguange(data);
      await this.ctx.meta.status.set(`config-${language}`, data);
    }

    async getLanguages() {
      const siteBase = await this.ctx.service.render.combineSiteBase();
      const languages = [];
      for (const item of siteBase.language.items.split(',')) {
        languages.push({
          title: this.ctx.text(item),
          value: item,
        });
      }
      return languages;
    }

    async getUrl({ language, path }) {
      const site = await this.ctx.service.render.getSite({ language });
      return this.ctx.service.render.getUrl(site, language, path);
    }

    _adjustConfigLanguange(data) {
      if (data) {
        delete data.host;
        delete data.language;
        delete data.themes;
      }
    }

    async buildLanguages() {
      // time start
      const timeStart = new Date();
      // site
      const site = await this.ctx.service.render.combineSiteBase();
      for (const language of site.language.items.split(',')) {
        await this.buildLanguage({ language });
      }
      // time end
      const timeEnd = new Date();
      const time = (timeEnd.valueOf() - timeStart.valueOf()) / 1000; // second
      return {
        time,
      };
    }

    async buildLanguage({ language }) {
      // time start
      const timeStart = new Date();

      // site
      const site = await this.ctx.service.render.getSite({ language });

      // / clear

      // intermediate
      const pathIntermediate = await this.ctx.service.render.getPathIntermediate(language);
      await fse.remove(pathIntermediate);

      // dist
      const pathDist = await this.ctx.service.render.getPathDist(site, language);
      const distPaths = [ 'articles', 'asserts', 'plugins', 'static', 'index.html', 'robots.txt', 'sitemap.xml', 'sitemapindex.xml' ];
      for (const item of distPaths) {
        await fse.remove(path.join(pathDist, item));
      }

      // / copy files to intermediate
      // /  plugins<theme<custom

      // plugins
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.plugin) {
          const pluginPath = path.join(module.root, 'backend/cms/plugin');
          const pluginFiles = await bb.fromCallback(cb => {
            glob(`${pluginPath}/\*`, cb);
          });
          for (const item of pluginFiles) {
            await fse.copy(item, path.join(pathIntermediate, 'plugins', relativeName, path.basename(item)));
          }
        }
      }

      // theme
      if (!site.themes[language]) this.ctx.throw(1002);
      const themeModule = this.app.meta.modules[site.themes[language]];
      if (!themeModule) this.ctx.throw(1003);
      const themePath = path.join(themeModule.root, 'backend/cms/theme');
      const themeFiles = await bb.fromCallback(cb => {
        glob(`${themePath}/\*`, cb);
      });
      for (const item of themeFiles) {
        await fse.copy(item, path.join(pathIntermediate, path.basename(item)));
      }

      // custom
      const customPath = await this.ctx.service.render.getPathCustom(language);
      const customFiles = await bb.fromCallback(cb => {
        glob(`${customPath}/\*`, cb);
      });
      for (const item of customFiles) {
        await fse.copy(item, path.join(pathIntermediate, path.basename(item)));
      }

      // / copy files to dist (ignore .ejs)
      // /  assets plugins/[plugin]/assets
      for (const dir of [ 'assets', 'plugins' ]) {
        if (dir === 'assets') {
          const _filename = path.join(pathIntermediate, 'assets');
          const exists = await fse.pathExists(_filename);
          if (exists) {
            await fse.copy(_filename, path.join(pathDist, 'assets'));
          }
        } else {
          const pluginsFiles = await bb.fromCallback(cb => {
            glob(`${pathIntermediate}/plugins/\*`, cb);
          });
          for (const item of pluginsFiles) {
            const _filename = `${item}/assets`;
            const exists = await fse.pathExists(_filename);
            if (exists) {
              await fse.copy(_filename, path.join(pathDist, 'plugins', path.basename(item), 'assets'));
            }
          }
        }
        const ejsFiles = await bb.fromCallback(cb => {
          glob(`${pathDist}/${dir}/\*\*/\*.ejs`, cb);
        });
        for (const item of ejsFiles) {
          await fse.remove(item);
        }
      }

      // / robots.txt
      await this.createRobots({ site });

      // / sitemapIndex
      await this.createSitemapIndex({ site });

      // render all files
      await this.ctx.service.render.renderAllFiles({ language });

      // time end
      const timeEnd = new Date();
      const time = (timeEnd.valueOf() - timeStart.valueOf()) / 1000; // second
      return {
        time,
      };
    }

    async createRobots({ site }) {
      // content
      const urlRawRoot = this.ctx.service.render.getUrlRawRoot(site);
      const content = `Sitemap: ${urlRawRoot}/sitemapindex.xml`;
      // write
      const pathRawDist = await this.ctx.service.render.getPathRawDist(site);
      await fse.outputFile(`${pathRawDist}/robots.txt`, content);
    }

    async createSitemapIndex({ site }) {
      // content
      const urlRawRoot = this.ctx.service.render.getUrlRawRoot(site);
      let items = '';
      for (const language of site.language.items.split(',')) {
        items +=
`  <sitemap>
    <loc>${urlRawRoot}${language === site.language.default ? '' : '/' + language}/sitemap.xml</loc>
  </sitemap>
`;
      }
      const content =
`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}</sitemapindex>`;
      // write
      const pathRawDist = await this.ctx.service.render.getPathRawDist(site);
      await fse.outputFile(`${pathRawDist}/sitemapindex.xml`, content);
    }

  }

  return Site;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const article = __webpack_require__(25);
const category = __webpack_require__(26);
const content = __webpack_require__(27);

module.exports = app => {
  const models = {
    article,
    category,
    content,
  };
  return models;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = app => {
  class Article extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticle', options: { disableDeleted: false } });
    }
  }
  return Article;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = app => {
  class Category extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsCategory', options: { disableDeleted: true } });
    }
  }
  return Category;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = app => {
  class Content extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsContent', options: { disableDeleted: false } });
    }
  }
  return Content;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(29)(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            title: 'Article',
            tableName: 'aCmsArticleView',
            tableNameFull: 'aCmsArticleViewFull',
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
          validator: 'article',
          search: {
            validator: 'articleSearch',
          },
        },
      },
      functions: {
        createArticle: {
          title: 'Create Article',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'article',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listArticle: {
          title: 'Article List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'article',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
        listArticleByCategory: {
          title: 'Article List(by category)',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'article',
          action: 'read',
          sorting: 1,
          menu: 1,
          actionPath: 'article/category',
        },
      },
    },
    validation: {
      validators: {
        article: {
          schemas: 'article',
        },
        articleSearch: {
          schemas: 'articleSearch',
        },
        category: {
          schemas: 'category',
        },
      },
      keywords: {},
      schemas: {
        article: schemas.article,
        articleSearch: schemas.articleSearch,
        category: schemas.category,
      },
    },
    settings: {
      instance: {
        actionPath: 'config/list',
      },
    },
  };
  return meta;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    meta: {
      custom: {
        component: 'articleItem',
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
        notEmpty: true,
      },
      categoryId: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Category',
        notEmpty: true,
      },
      sticky: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Sticky',
        default: false,
      },
      keywords: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Keywords',
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Description',
      },
      editMode: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Edit Mode',
        notEmpty: true,
      },
      slug: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Slug',
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      flag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      extra: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Extra Attributes',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
      allowComment: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Comment',
        default: false,
      },
    },
  };

  // article search
  schemas.articleSearch = {
    type: 'object',
    meta: {
      custom: {
        component: 'articleSearch',
      },
    },
    properties: {
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebMultiple: false,
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

  // category
  schemas.category = {
    type: 'object',
    properties: {
      categoryName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Category name',
        notEmpty: true,
      },
      hidden: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Hidden',
        default: false,
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      flag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      catalog: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Catalog',
        ebReadOnly: true,
        default: false,
      },
      language: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Language',
        ebReadOnly: true,
        notEmpty: true,
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map