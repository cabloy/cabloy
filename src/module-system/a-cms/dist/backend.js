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
  const services = __webpack_require__(19)(app);
  // models
  const models = __webpack_require__(27)(app);
  // meta
  const meta = __webpack_require__(34)(app);

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

  // queues
  config.queues = {
    buildLanguage: {
      path: 'queue/buildLanguage',
    },
    buildLanguages: {
      path: 'queue/buildLanguages',
    },
    renderArticle: {
      path: 'queue/renderArticle',
    },
    deleteArticle: {
      path: 'queue/deleteArticle',
    },
  };

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
    publishOnSubmit: true,
  };

  // checkFileTimeout
  config.checkFileTimeout = 500;

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
      brother: {
        order: 'desc',
      },
    },
    profile: {
      userName: 'zhennann',
      motto: 'Less is more, while more is less.',
      avatar: 'assets/images/avatar.jpg',
      url: 'index.html',
      extra: '',
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
  All: '所有',
  Article: '文章',
  Catalog: '目录',
  Category: '目录',
  Categories: '目录',
  Comment: '评论',
  Comments: '评论',
  Language: '语言',
  Publish: '发布',
  Publishing: '发布中',
  Published: '已发布',
  Search: '搜索',
  Submit: '提交',
  Sorting: '排序',
  Tag: '标签',
  Tags: '标签',
  Url: '链接',
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
const tag = __webpack_require__(15);
const comment = __webpack_require__(16);
const rss = __webpack_require__(17);
const queue = __webpack_require__(18);

module.exports = app => {
  let routes = [
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
    { method: 'post', path: 'article/list', controller: article },
    { method: 'post', path: 'article/attachments', controller: article },
    // comment
    { method: 'post', path: 'comment/all', controller: comment },
    // render
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
    { method: 'post', path: 'site/buildLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguages', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getLanguages', controller: site },
    { method: 'post', path: 'site/getUrl', controller: site },
    // category
    { method: 'post', path: 'category/item', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/save', controller: category, middlewares: 'validate', meta: {
      validate: { validator: 'category' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    } },
    { method: 'post', path: 'category/tree', controller: category }, // not set function right
    { method: 'post', path: 'category/children', controller: category }, // not set function right
    { method: 'post', path: 'category/add', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/delete', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/move', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/relativeTop', controller: category }, // not set function right
    // tag
    { method: 'post', path: 'tag/list', controller: tag },
    // rss
    { method: 'get', path: 'rss/feed/:language', controller: rss, action: 'feed' },
    { method: 'get', path: 'rss/feed/comments/:language', controller: rss, action: 'feedComments' },
    { method: 'get', path: 'rss/feed/article/comments/:atomId', controller: rss, action: 'articleComments' },
    // queue
    { method: 'post', path: 'queue/buildLanguage', controller: queue, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'queue/buildLanguages', controller: queue, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'queue/renderArticle', controller: queue, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'queue/deleteArticle', controller: queue, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      // site
      { method: 'post', path: 'site/checkFile', controller: site },
    ]);
  }
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
      const options = this.ctx.request.body.options;
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
      // key
      const key = this.ctx.request.body.key;
      // options
      const options = this.ctx.request.body.options || {};
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
          key,
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

    async tree() {
      const list = await this.ctx.service.category.tree({
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async children() {
      const list = await this.ctx.service.category.children({
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
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

    async relativeTop() {
      const res = await this.ctx.service.category.relativeTop({
        categoryId: this.ctx.request.body.categoryId,
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

    async getArticleUrl() {
      const res = await this.ctx.service.render.getArticleUrl(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return RenderController;
};



/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const fse = require3('fs-extra');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
      // queue
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'buildLanguage',
        data: { language: this.ctx.request.body.language },
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      // queue
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'buildLanguages',
        data: null,
      });
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

    async checkFile() {
      // file
      const file = this.ctx.request.body.file;
      // mtime
      const exists = await fse.pathExists(file);
      if (!exists) {
        // deleted
        this.ctx.success(null);
      } else {
        const stats = await fse.stat(file);
        this.ctx.success({ mtime: stats.mtime });
      }
    }

  }
  return SiteController;
};



/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {

  class TagController extends app.Controller {

    async list() {
      const list = await this.ctx.service.tag.list({
        options: this.ctx.request.body.options,
      });
      this.ctx.success({ list });
    }

  }
  return TagController;
};



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      // options
      const options = this.ctx.request.body.options;
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
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class RSSController extends app.Controller {

    async feed() {
      // language
      const language = this.ctx.params.language;
      // options
      const options = {
        where: {
          'f.language': language,
        },
        orders: [
          [ 'a.updatedAt', 'desc' ],
        ],
        page: { index: 0 },
        mode: 'list',
      };
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/cms/article/list',
        body: { options },
      });
      const list = res.list;
      // site
      const site = await this.ctx.service.render.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[${site.base.title}]]></title>
    <link>${this.ctx.service.render.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const article of list) {
        feed +=
`
    <item>
      <title>
        <![CDATA[
          ${article.atomName}
        ]]>
      </title>
      <link>
        ${this.ctx.service.render.getUrl(site, language, article.url)}
      </link>
      <description>
        <![CDATA[
          ${article.description || article.summary}
        ]]>
      </description>
      <category><![CDATA[${article.categoryName}]]></category>
      <pubDate>${article.updatedAt}</pubDate>
      <dc:creator><![CDATA[${article.userName}]]></dc:creator>
    </item>
`;
      }
      feed +=
`
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }

    async feedComments() {
      // language
      const language = this.ctx.params.language;
      // options
      const options = {
        orders: [
          [ 'h_updatedAt', 'desc' ],
        ],
        page: { index: 0 },
      };
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/cms/comment/all',
        body: {
          options,
        },
      });
      const list = res.list;
      // site
      const site = await this.ctx.service.render.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments for ${site.base.title}]]></title>
    <link>${this.ctx.service.render.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const item of list) {
        feed +=
`
    <item>
      <title>
        <![CDATA[
          Comment on ${item.atomName}
        ]]>
      </title>
      <link>
        ${this.ctx.service.render.getUrl(site, language, item.url)}#comments
      </link>
      <description>
        <![CDATA[
          ${item.h_summary}
        ]]>
      </description>
      <pubDate>${item.h_updatedAt}</pubDate>
      <dc:creator><![CDATA[${item.h_userName}]]></dc:creator>
    </item>
`;
      }
      feed +=
`
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }

    async articleComments() {
      // atomId
      const atomId = this.ctx.params.atomId;
      // article
      const article = await this.ctx.service.render._getArticle({ key: { atomId }, inner: false });
      // language
      const language = article.language;
      // options
      const options = {
        orders: [
          [ 'updatedAt', 'desc' ],
        ],
        page: { index: 0 },
      };
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/comment/list',
        body: {
          key: { atomId },
          options,
        },
      });
      const list = res.list;
      // site
      const site = await this.ctx.service.render.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments on: ${article.atomName}]]></title>
    <link>${this.ctx.service.render.getUrl(site, language, article.url)}</link>
    <description><![CDATA[${article.description || article.summary}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const item of list) {
        feed +=
`
    <item>
      <title>
        <![CDATA[
          Comment on ${article.atomName}
        ]]>
      </title>
      <link>
        ${this.ctx.service.render.getUrl(site, language, article.url)}#comments
      </link>
      <description>
        <![CDATA[
          ${item.summary}
        ]]>
      </description>
      <pubDate>${item.updatedAt}</pubDate>
      <dc:creator><![CDATA[${item.userName}]]></dc:creator>
    </item>
`;
      }
      feed +=
`
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }

  }
  return RSSController;
};



/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  class QueueController extends app.Controller {

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

    async renderArticle() {
      const res = await this.ctx.service.render.renderArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

    async deleteArticle() {
      const res = await this.ctx.service.render.deleteArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return QueueController;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(20);
const article = __webpack_require__(21);
const category = __webpack_require__(22);
const render = __webpack_require__(23);
const site = __webpack_require__(25);
const tag = __webpack_require__(26);

module.exports = app => {
  const services = {
    version,
    article,
    category,
    render,
    site,
    tag,
  };
  return services;
};


/***/ }),
/* 20 */
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

      if (options.version === 2) {
        // create table: aCmsTag
        let sql = `
          CREATE TABLE aCmsTag (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            tagName varchar(50) DEFAULT NULL,
            articleCount int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aCmsArticleTag
        sql = `
          CREATE TABLE aCmsArticleTag (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            tags JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aCmsArticleTagRef
        sql = `
          CREATE TABLE aCmsArticleTagRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            tagId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // alter view: aCmsArticleView
        await this.ctx.model.query('drop view aCmsArticleView');
        sql = `
          CREATE VIEW aCmsArticleView as
            select a.*,b.categoryName,e.tags from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsArticleTag e on a.id=e.itemId
        `;
        await this.ctx.model.query(sql);

        // alter view: aCmsArticleViewFull
        await this.ctx.model.query('drop view aCmsArticleViewFull');
        sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.categoryName,e.tags,c.content,c.html from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aCmsArticleTag e on a.id=e.itemId
        `;
        await this.ctx.model.query(sql);

        // create view: aCmsArticleViewSearch
        sql = `
          CREATE VIEW aCmsArticleViewSearch as
            select a.*,b.categoryName,e.tags,c.content,c.html,concat(d.atomName,',',c.content) contentSearch from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aAtom d on a.atomId=d.id
              left join aCmsArticleTag e on a.id=e.itemId
        `;
        await this.ctx.model.query(sql);

        // create view: aCmsArticleViewTag
        sql = `
          CREATE VIEW aCmsArticleViewTag as
            select a.*,b.categoryName,e.tags,f.tagId from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsArticleTag e on a.id=e.itemId
              left join aCmsArticleTagRef f on a.id=f.itemId
        `;
        await this.ctx.model.query(sql);

      }

      if (options.version === 3) {
        // alter table: aCmsArticle
        let sql = `
        ALTER TABLE aCmsArticle
          ADD COLUMN audioFirst varchar(255) DEFAULT NULL,
          ADD COLUMN audioCoverFirst varchar(255) DEFAULT NULL
                  `;
        await this.ctx.model.query(sql);

        // alter view: aCmsArticleView
        await this.ctx.model.query('drop view aCmsArticleView');
        sql = `
          CREATE VIEW aCmsArticleView as
            select a.*,b.categoryName,e.tags from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsArticleTag e on a.id=e.itemId
        `;
        await this.ctx.model.query(sql);

        // alter view: aCmsArticleViewFull
        await this.ctx.model.query('drop view aCmsArticleViewFull');
        sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.categoryName,e.tags,c.content,c.html from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aCmsArticleTag e on a.id=e.itemId
        `;
        await this.ctx.model.query(sql);

        // alter view: aCmsArticleViewSearch
        await this.ctx.model.query('drop view aCmsArticleViewSearch');
        sql = `
          CREATE VIEW aCmsArticleViewSearch as
            select a.*,b.categoryName,e.tags,c.content,c.html,concat(d.atomName,',',c.content) contentSearch from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsContent c on a.id=c.itemId
              left join aAtom d on a.atomId=d.id
              left join aCmsArticleTag e on a.id=e.itemId
        `;
        await this.ctx.model.query(sql);

        // alter view: aCmsArticleViewTag
        await this.ctx.model.query('drop view aCmsArticleViewTag');
        sql = `
          CREATE VIEW aCmsArticleViewTag as
            select a.*,b.categoryName,e.tags,f.tagId from aCmsArticle a
              left join aCmsCategory b on a.categoryId=b.id
              left join aCmsArticleTag e on a.id=e.itemId
              left join aCmsArticleTagRef f on a.id=f.itemId
        `;
        await this.ctx.model.query(sql);

      }

      if (options.version === 4) {
        // alter table: aCmsCategory
        const sql = `
        ALTER TABLE aCmsCategory
          ADD COLUMN url varchar(255) DEFAULT NULL
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Article extends app.Service {

    async create({ atomClass, key, item, user }) {
      const site = await this.ctx.service.render.combineSiteBase();
      const editMode = site.edit.mode;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
      if (item.language) params.language = item.language;
      if (item.categoryId) params.categoryId = item.categoryId;
      const res = await this.ctx.model.article.insert(params);
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
      // get atom for safety
      const atomOld = await this.ctx.meta.atom.read({ key, user });

      // url
      let url;
      if (item.slug) {
        url = `articles/${item.slug}.html`;
      } else {
        url = atomOld.url || `articles/${uuid.v4().replace(/-/g, '')}.html`;
      }
      // image first
      let imageFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/!\[[^\]]*?\]\(([^\)]*?)\)/);
        imageFirst = (matches && matches[1]) || '';
      }
      // audio first
      let audioFirst = '';
      let audioCoverFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/:::\s*audio([\s\S]*?):::/);
        let options = matches && matches[1];
        if (options) {
          options = JSON.parse(options);
          if (options && options.audio) {
            if (Array.isArray(options.audio)) {
              audioFirst = options.audio[0].url;
              audioCoverFirst = options.audio[0].cover;
            } else {
              audioFirst = options.audio.url;
              audioCoverFirst = options.audio.cover;
            }
          }
        }
      }
      // markdown
      const md = markdown.create();
      let html;
      // html
      if (item.editMode === 1) {
        html = item.content ? md.render(item.content) : '';
      } else {
        html = item.content || '';
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
        url,
        editMode: item.editMode,
        slug: item.slug,
        sorting: item.sorting,
        flag: item.flag,
        extra: item.extra || '{}',
        imageFirst,
        audioFirst,
        audioCoverFirst,
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?',
        [ item.content, html, this.ctx.instance.id, key.atomId ]);

      // tags
      const tagsNew = await this.ctx.service.tag.updateArticleTags({ key, item });

      // set tag count , force check if delete tags
      // if (atomOld.atomFlag === 2) {
      await this.ctx.service.tag.setTagArticleCount({ tagsNew, tagsOld: atomOld.tags });
      // }

      // render
      await this._renderArticle({ key, inner: atomOld.atomFlag !== 2 });
    }

    async delete({ atomClass, key, user }) {
      // get atom for safety
      const atomOld = await this.ctx.meta.atom.read({ key, user });

      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.content.delete({
        itemId: key.itemId,
      });

      // delete tags
      await this.ctx.service.tag.deleteArticleTags({ key });

      // set tag count , force check if delete tags
      // if (atomOld.atomFlag === 2) {
      await this.ctx.service.tag.setTagArticleCount({ tagsNew: null, tagsOld: atomOld.tags });
      // }

      // delete article
      await this._deleteArticle({ key, article: atomOld, inner: atomOld.atomFlag !== 2 });
    }

    async action({ action, atomClass, key, user }) {
      if (action === 101) {
        // get atom for safety
        const atomOld = await this.ctx.meta.atom.read({ key, user });

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

        // tags
        if (atomOld.atomFlag !== 2) {
          await this.ctx.service.tag.setTagArticleCount({ tagsOld: atomOld.tags });
        }

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

    async _deleteArticle({ key, article, inner }) {
      await this.ctx.dbMeta.next(async () => {
        // queue not async
        await this.ctx.app.meta.queue.push({
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'deleteArticle',
          data: { key, article, inner },
        });
      });
    }

    async _renderArticle({ key, inner }) {
      await this.ctx.dbMeta.next(async () => {
        // queue not async
        await this.ctx.app.meta.queue.push({
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'renderArticle',
          data: { key, inner },
        });
      });
    }

  }

  return Article;
};


/***/ }),
/* 22 */
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
        url: data.url,
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

    async relativeTop({ categoryId }) {
      return await this._relativeTop({ categoryId });
    }

    async _relativeTop({ categoryId }) {
      const category = await this.item({ categoryId });
      if (!category) return null;
      if (category.url) return category;
      return await this._relativeTop({ categoryId: category.categoryIdParent });
    }

  }

  return Category;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(1);
const require3 = __webpack_require__(0);
const ejs = require3('@zhennann/ejs');
const pMap = require3('p-map');
const extend = require3('extend2');
const fse = require3('fs-extra');
const moment = require3('moment');
const glob = require3('glob');
const bb = require3('bluebird');
const CleanCSS = require3('clean-css');
const shajs = require3('sha.js');
const babel = require3('@babel/core');
const UglifyJS = require3('uglify-js');
const time = __webpack_require__(24);

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

    async deleteArticle({ key, article, inner }) {
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language: article.language });
      // remove file
      const pathDist = await this.getPathDist(site, article.language);
      await fse.remove(path.join(pathDist, article.url));
      if (!inner) {
        // remove sitemap
        let xml = await fse.readFile(path.join(pathDist, 'sitemap.xml'));
        const regexp = new RegExp(` {2}<url>\\s+<loc>[^<]*${article.url}[^<]*</loc>[\\s\\S]*?</url>[\\r\\n]`);
        xml = xml.toString().replace(regexp, '');
        // save
        await fse.writeFile(path.join(pathDist, 'sitemap.xml'), xml);
        // render index
        await this._renderIndex({ site });
      }
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
      await this._renderFile({
        fileSrc: 'main/article.ejs',
        fileDest: article.url,
        data,
      });
    }

    async _renderFile({ fileSrc, fileDest, data }) {
      // site
      const site = data.site;
      // language
      const language = site.language.current;
      // src
      const pathIntermediate = await this.getPathIntermediate(language);
      const fileName = path.join(pathIntermediate, fileSrc);
      // dest
      const pathDist = await this.getPathDist(site, language);
      const fileWrite = path.join(pathDist, fileDest);
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
      // hot load
      if (this.app.meta.isTest || this.app.meta.isLocal) {
        content += `
<script language="javascript">
$(document).ready(function() {
  var __checkFileTimeout = ${this.ctx.config.checkFileTimeout};
  var __fileTime;
  function __checkFile() {
    util.performAction({
      method: 'post',
      url: '/a/cms/site/checkFile',
      body: { file: '${fileWrite}' }
    }).then(function(stats) {
      if (!stats) {
        return window.setTimeout(__checkFile, __checkFileTimeout);
      }
      if (!__fileTime) {
        __fileTime = stats.mtime;
        return window.setTimeout(__checkFile, __checkFileTimeout);
      }
      if (__fileTime === stats.mtime) {
        return window.setTimeout(__checkFile, __checkFileTimeout);
      }
      location.reload(true);
    }).catch(function(){
      return window.setTimeout(__checkFile, __checkFileTimeout);
    });
  }
  __checkFile();
});
</script>
          `;
      }
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
              _content = babel.transform(_content, { ast: false, babelrc: false, presets: [ '@babel/preset-env' ] }).code;
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
      return await this.ctx.meta.base.getPath('cms');
    }
    async getPathRawDist() {
      return await this.ctx.meta.base.getPath('cms/dist');
    }

    getUrlRawRoot(site) {
      if (this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal) {
        const publicDir = this.ctx.app.config.static.prefix;
        const prefix = this.ctx.meta.base.host ? `${this.ctx.meta.base.protocol}://${this.ctx.meta.base.host}` : '';
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
      return this.ctx.meta.base.getAbsoluteUrl(path);
    }

    async getData({ site }) {
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
          return require3(_path);
        },
        url(fileName, language) {
          if (fileName.indexOf('http://') === 0 || fileName.indexOf('https://') === 0) return fileName;
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
      // base
      const siteBase = await this.combineSiteBase();
      // site
      const site = await this.combineSite({ siteBase, language });
      // serverUrl
      site.serverUrl = this.getServerUrl('');
      // languages
      site.languages = [];
      for (const item of site.language.items.split(',')) {
        site.languages.push({
          name: item,
          title: this.ctx.text.locale(item, item),
          url: this.getUrl(site, item, 'index.html'),
        });
      }
      return site;
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
      const theme = this.combineThemes(themeModuleName);
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

    // theme extend
    combineThemes(themeModuleName) {
      return this._combineThemes(themeModuleName);
    }

    _combineThemes(themeModuleName) {
      // module
      const module = this.app.meta.modules[themeModuleName];
      if (!module) this.ctx.throw(1003);
      const moduleExtend = module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.extend;
      if (!moduleExtend) return this.ctx.config.module(themeModuleName).theme;
      return extend(true, {},
        this._combineThemes(moduleExtend),
        this.ctx.config.module(themeModuleName).theme
      );
    }

  }

  return Render;
};


/***/ }),
/* 24 */
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
/* 25 */
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
      //   solution: 1
      // const distPaths = [ 'articles', 'asserts', 'plugins', 'static', 'index.html', 'robots.txt', 'sitemap.xml', 'sitemapindex.xml' ];
      // for (const item of distPaths) {
      //   await fse.remove(path.join(pathDist, item));
      // }
      //   solution: 2
      const distFiles = await bb.fromCallback(cb => {
        glob(`${pathDist}/\*`, cb);
      });
      const languages = site.language.items.split(',');
      for (const item of distFiles) {
        if (languages.indexOf(path.basename(item)) === -1) {
          await fse.remove(item);
        }
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
      await this.copyThemes(pathIntermediate, site.themes[language]);

      // custom
      const customPath = await this.ctx.service.render.getPathCustom(language);
      const customFiles = await bb.fromCallback(cb => {
        glob(`${customPath}/\*`, cb);
      });
      for (const item of customFiles) {
        await fse.copy(item, path.join(pathIntermediate, path.basename(item)));
      }

      // custom dist
      const customDistFiles = await bb.fromCallback(cb => {
        glob(`${customPath}/dist/\*`, cb);
      });
      for (const item of customDistFiles) {
        await fse.copy(item, path.join(pathDist, path.basename(item)));
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

    // theme extend
    async copyThemes(pathIntermediate, themeModuleName) {
      await this._copyThemes(pathIntermediate, themeModuleName);
    }

    async _copyThemes(pathIntermediate, themeModuleName) {
      // module
      const module = this.app.meta.modules[themeModuleName];
      if (!module) this.ctx.throw(1003);
      // extend
      const moduleExtend = module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.extend;
      if (moduleExtend) {
        await this._copyThemes(pathIntermediate, moduleExtend);
      }
      // current
      const themePath = path.join(module.root, 'backend/cms/theme');
      const themeFiles = await bb.fromCallback(cb => {
        glob(`${themePath}/\*`, cb);
      });
      for (const item of themeFiles) {
        await fse.copy(item, path.join(pathIntermediate, path.basename(item)));
      }
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
/* 26 */
/***/ (function(module, exports) {

module.exports = app => {

  class Tag extends app.Service {

    async list({ options }) {
      return await this.ctx.model.tag.select(options);
    }

    async create({ language, tagName }) {
      // check if exists
      const tag = await this.ctx.model.tag.get({
        language, tagName,
      });
      if (tag) return tag.id;
      // insert
      const res = await this.ctx.model.tag.insert({
        language, tagName, articleCount: 0,
      });
      return res.insertId;
    }

    async updateArticleTags({ key, item }) {
      // tags
      let tags = null;
      if (item.tags) {
        tags = JSON.parse(item.tags);
        for (const tag of tags) {
          if (tag.id === 0) {
            tag.id = await this.create({ language: item.language, tagName: tag.name });
          }
        }
      }
      // force delete
      await this.deleteArticleTags({ key });
      // new
      if (tags && tags.length > 0) {
        await this.ctx.model.articleTag.insert({
          atomId: key.atomId,
          itemId: key.itemId,
          tags: JSON.stringify(tags),
        });
        for (const tag of tags) {
          await this.ctx.model.articleTagRef.insert({
            atomId: key.atomId,
            itemId: key.itemId,
            tagId: tag.id,
          });
        }
      }
      // ok
      return tags;
    }

    async deleteArticleTags({ key }) {
      await this.ctx.model.articleTag.delete({
        itemId: key.itemId,
      });
      await this.ctx.model.articleTagRef.delete({
        itemId: key.itemId,
      });
    }

    async setTagArticleCount({ tagsNew, tagsOld }) {
      // tags
      const tags = {};
      if (tagsNew) {
        const _tags = typeof tagsNew === 'string' ? JSON.parse(tagsNew) : tagsNew;
        for (const tag of _tags) {
          tags[tag.id] = tag;
        }
      }
      if (tagsOld) {
        const _tags = typeof tagsOld === 'string' ? JSON.parse(tagsOld) : tagsOld;
        for (const tag of _tags) {
          tags[tag.id] = tag;
        }
      }
      // loop
      for (const id in tags) {
        const articleCount = await this.calcArticleCount({ id });
        if (articleCount > 0) {
          // update
          await this.ctx.model.tag.update({ id, articleCount });
        } else {
          const articleCount2 = await this.calcArticleCount2({ id });
          if (articleCount2 > 0) {
            // update
            await this.ctx.model.tag.update({ id, articleCount });
          } else {
            // delete
            await this.ctx.model.tag.delete({ id });
          }
        }
      }
    }

    async calcArticleCount({ id }) {
      const res = await this.ctx.model.query(`
        select count(*) articleCount from aCmsArticleTagRef a
          inner join aAtom b on a.atomId=b.id
          where a.iid=? and a.tagId=? and b.iid=? and b.deleted=0 and b.atomFlag=2
        `,
      [ this.ctx.instance.id, id, this.ctx.instance.id ]);
      return res[0].articleCount;
    }

    async calcArticleCount2({ id }) {
      const res = await this.ctx.model.query(`
        select count(*) articleCount from aCmsArticleTagRef a where a.iid=? and a.tagId=?
        `,
      [ this.ctx.instance.id, id ]);
      return res[0].articleCount;
    }

  }

  return Tag;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const article = __webpack_require__(28);
const category = __webpack_require__(29);
const content = __webpack_require__(30);
const tag = __webpack_require__(31);
const articleTag = __webpack_require__(32);
const articleTagRef = __webpack_require__(33);

module.exports = app => {
  const models = {
    article,
    category,
    content,
    tag,
    articleTag,
    articleTagRef,
  };
  return models;
};


/***/ }),
/* 28 */
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
/* 29 */
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
/* 30 */
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
/* 31 */
/***/ (function(module, exports) {

module.exports = app => {
  class Tag extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsTag', options: { disableDeleted: true } });
    }
  }
  return Tag;
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = app => {
  class ArticleTag extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticleTag', options: { disableDeleted: true } });
    }
  }
  return ArticleTag;
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = app => {
  class ArticleTagRef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticleTagRef', options: { disableDeleted: true } });
    }
  }
  return ArticleTagRef;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(35)(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            title: 'Article',
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
/* 35 */
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
        ebOptionsBlankAuto: true,
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
      tags: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Tags',
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
      url: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Url',
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map