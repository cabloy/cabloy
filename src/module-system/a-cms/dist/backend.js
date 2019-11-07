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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports) {


/**
  escapeHtml: based on markdown-it
**/

const HTML_ESCAPE_TEST_RE = /[&<>"']/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"']/g;
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#039;',
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

const URL_ESCAPE_TEST_RE = /[<>"']/;
const URL_ESCAPE_REPLACE_RE = /[<>"']/g;
const URL_REPLACEMENTS = {
  '<': '%3C',
  '>': '%3E',
  '"': '%22',
  '\'': '%27',
};

function replaceUnsafeCharURL(ch) {
  return URL_REPLACEMENTS[ch];
}

function escapeURL(str) {
  if (URL_ESCAPE_TEST_RE.test(str)) {
    return str.replace(URL_ESCAPE_REPLACE_RE, replaceUnsafeCharURL);
  }
  return str;
}

module.exports = {
  atomClass(atomClass) {
    let _atomClass;
    if (atomClass) {
      _atomClass = {
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        atomClassIdParent: atomClass.atomClassIdParent || 0,
      };
      if (atomClass.id) _atomClass.id = atomClass.id;
    } else {
      _atomClass = {
        module: 'a-cms',
        atomClassName: 'article',
        atomClassIdParent: 0,
      };
    }
    return _atomClass;
  },
  async atomClass2(ctx, atomClass) {
    const _atomClass = this.atomClass(atomClass);
    if (!_atomClass.id) {
      const res = await ctx.meta.atomClass.get(_atomClass);
      _atomClass.id = res.id;
    }
    return _atomClass;
  },
  escapeHtml(str) {
    return escapeHtml(str);
  },
  escapeURL(str) {
    return escapeURL(str);
  },
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(19);
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
const time = __webpack_require__(20);
const utils = __webpack_require__(1);

class Build {

  constructor(ctx, atomClass) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.atomClass = utils.atomClass(atomClass);
    this.default = this.atomClass.module === 'a-cms';
  }

  async getConfigSiteBase() {
    // config
    //    try other then default
    let configSite = this.ctx.config.module(this.atomClass.module).site;
    if (!configSite) {
      configSite = this.ctx.config.site;
    }

    // site
    const site = extend(true, {}, configSite);

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
    const name = this.default ? 'config-site' : `config-site:${this.atomClass.module}`;
    return await this.ctx.meta.status.get(name);
  }

  async setConfigSite({ data }) {
    const name = this.default ? 'config-site' : `config-site:${this.atomClass.module}`;
    await this.ctx.meta.status.set(name, data);
  }

  async getConfigLanguage({ language }) {
    const name = this.default ? `config-${language}` : `config-${language}:${this.atomClass.module}`;
    return await this.ctx.meta.status.get(name);
  }

  async setConfigLanguage({ language, data }) {
    const name = this.default ? `config-${language}` : `config-${language}:${this.atomClass.module}`;
    this._adjustConfigLanguange(data);
    await this.ctx.meta.status.set(name, data);
  }

  async getConfigLanguagePreview({ language }) {
    const site = await this.getSite({ language });
    this._adjustConfigLanguange(site);
    return site;
  }

  _adjustConfigLanguange(data) {
    if (data) {
      data.host = undefined;
      data.language = undefined;
      data.themes = undefined;
    }
  }

  async getLanguages() {
    const siteBase = await this.combineSiteBase();
    const languages = [];
    for (const item of siteBase.language.items.split(',')) {
      languages.push({
        title: this.ctx.text(item),
        value: item,
      });
    }
    return languages;
  }

  // site<plugin<theme<site(db)<language(db)
  async combineSiteBase() {
    // site
    const site = await this.getConfigSiteBase();
    // site(db) special for language/themes
    const configSite = await this.getConfigSite();
    if (configSite && configSite.language) site.language = configSite.language;
    if (configSite && configSite.themes) site.themes = configSite.themes;
    return site;
  }

  // site<plugin<theme<site(db)<language(db)
  async combineSite({ siteBase, language }) {
    // themeModuleName
    const themeModuleName = siteBase.themes[language];
    if (!themeModuleName) {
      this.ctx.throw(1002);
    }
    // theme
    const theme = this.combineThemes(themeModuleName);
    // site(db)
    const configSite = await this.getConfigSite();
    // language(db)
    const configLanguage = await this.getConfigLanguage({ language });
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

  // site<plugin<theme<site(db)<language(db)
  async getSite({ language, options }) {
    // options
    options = options || {};
    // base
    const siteBase = await this.combineSiteBase();
    // site
    const site = await this.combineSite({ siteBase, language });
    // serverUrl
    site.serverUrl = this.getServerUrl('');
    // atomClass
    site.atomClass = this.atomClass;
    // languages
    site.languages = [];
    for (const item of site.language.items.split(',')) {
      site.languages.push({
        name: item,
        title: this.ctx.text.locale(item, item),
        url: this.getUrl(site, item, 'index.html'),
      });
    }
    // front
    site.front = {};
    // front.env
    site.front.env = extend(true, {
      base: site.base,
      language: site.language,
    }, site.env, {
      site: {
        serverUrl: site.serverUrl,
        rawRootUrl: this.getUrlRawRoot(site),
        atomClass: this.atomClass,
      },
    });
    // front.envs
    if (options.envs !== false) {
      const envs = await this.getFrontEnvs({ language });
      if (Object.keys(envs).length > 0) {
        site.front.envs = envs;
      }
    }

    // ok
    return site;
  }

  // ////////////////////////////// url or path

  getCMSPathName() {
    return this.default ? 'cms' : `cms.${this.atomClass.module}`;
  }

  getUrlRawRoot(site) {
    if (this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal) {
      // cms or cms.moduleName
      const cmsPathName = this.getCMSPathName();
      const publicDir = this.ctx.app.config.static.prefix;
      const prefix = this.ctx.meta.base.host ? `${this.ctx.meta.base.protocol}://${this.ctx.meta.base.host}` : '';
      return `${prefix}${publicDir}${this.ctx.instance.id}/${cmsPathName}/dist`;
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
    // cms
    return await this.ctx.meta.base.getPath(this.getCMSPathName());
  }
  async getPathRawDist() {
    // cms/dist
    return await this.ctx.meta.base.getPath(`${this.getCMSPathName()}/dist`);
  }

  // ///////////////////////////////// render

  async renderAllFiles({ language, progressId, progressNo }) {
    // clearCache
    ejs.clearCache();
    // site
    const site = await this.getSite({ language });
    // render static
    await this._renderStatic({ site });
    // render articles
    await this._renderArticles({ site, progressId, progressNo });
    // render index
    await this._renderIndex({ site });
  }

  async renderArticle({ key, inner }) {
    // article
    const article = await this.ctx.service.article._getArticle({ key, inner });
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

  async _renderArticles({ site, progressId, progressNo }) {
    // anonymous user
    const user = await this.ctx.meta.user.anonymous();
    // articles
    const articles = await this.ctx.meta.atom.select({
      atomClass: this.atomClass,
      options: {
        where: {
          'a.atomFlag': 2,
          'f.language': site.language.current,
        },
        orders: [[ 'a.updatedAt', 'desc' ]],
        page: null,
        mode: 'search',
      },
      user: { id: user.id },
      pageForce: false,
    });

    // progress
    const progress1_Total = articles.length;
    let progress1_progress = 0;

    // concurrency
    const mapper = async article => {
      // progress: initialize
      await this.ctx.meta.progress.update({
        progressId,
        progressNo,
        total: progress1_Total,
        progress: progress1_progress++,
        text: article.atomName,
      });
      // render article
      await this._renderArticle({ site, article });
    };
    await pMap(articles, mapper, { concurrency: 10 });
    // write sitemap
    await this._writeSitemaps({ site, articles });
  }

  async _renderArticle({ site, article }) {
    // data
    const data = await this.getData({ site });
    data.article = article;
    // render
    await this._renderFile({
      fileSrc: 'main/article.ejs',
      fileDest: article.url,
      fileDestAlt: `articles/${article.uuid}.html`,
      data,
    });
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

  async _renderFile({ fileSrc, fileDest, fileDestAlt, data }) {
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
    data.env('site.path', data._path);
    // load src
    let contentSrc = await fse.readFile(fileName);
    // load includes of plugins
    const pluginIncludes = await this._loadPluginIncludes({ site, language });
    contentSrc = `${pluginIncludes}\n${contentSrc}`;
    // render
    const options = this.getOptions();
    options.filename = fileName;
    let content = await ejs.render(contentSrc, data, options);
    content = await this._renderEnvs({ data, content });
    content = await this._renderCSSJSes({ data, content });
    // hot load
    if (this.app.meta.isTest || this.app.meta.isLocal) {
      content += `
<script language="javascript">
$(document).ready(function() {
  var __checkFileTimeout = ${this.ctx.config.checkFile.timeout};
  var __fileTime=0;
  function __checkFile() {
    util.performAction({
      method: 'post',
      url: '/a/cms/site/checkFile',
      body: { file: '${fileWrite}', mtime: __fileTime }
    }).then(function(stat) {
      if (!stat) {
        return window.setTimeout(__checkFile, __checkFileTimeout);
      }
      if (!__fileTime) {
        __fileTime = stat.mtime;
        return window.setTimeout(__checkFile, __checkFileTimeout);
      }
      if (__fileTime === stat.mtime) {
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
    // alternative url
    if (fileDestAlt && fileDestAlt !== fileDest) {
      const fileWriteAlt = path.join(pathDist, fileDestAlt);
      await fse.outputFile(fileWriteAlt, content);
    }
  }

  async _loadPluginIncludes({ site, language }) {
    // if exists
    if (site._pluginIncludes) return site._pluginIncludes;
    // modulesArray
    let pluginIncludes = '';
    for (const module of this.app.meta.modulesArray) {
      if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.plugin) {
        // path intermediate
        const pathIntermediate = await this.getPathIntermediate(language);
        let incudeFileName = path.join(pathIntermediate, `plugins/${module.info.relativeName}/include.ejs`);
        const exists = await fse.pathExists(incudeFileName);
        if (exists) {
          incudeFileName = incudeFileName.replace(/\\/g, '\\\\');
          pluginIncludes = `${pluginIncludes}<%- await include('${incudeFileName}') %>\n`;
        }
      }
    }
    // ok
    site._pluginIncludes = pluginIncludes;
    return site._pluginIncludes;
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
            // not minify for test/dev
            if (!this.ctx.app.meta.isTest && !this.ctx.app.meta.isLocal) {
              const output = UglifyJS.minify(_content);
              if (output.error) throw new Error(`${output.error.name}: ${output.error.message}`);
              _content = output.code;
            }
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
    const env = extend(true, site.front.env, _env);
    // front.envs
    if (site.front.envs) {
      env.envs = site.front.envs;
    }
    // article
    if (data.article) {
      env.article = extend(true, {}, data.article);
      // delete
      env.article.summary = undefined;
      env.article.content = undefined;
      env.article.html = undefined;
      env.article.contentSearch = undefined;
    }
    // replace
    const text = `
<script type="text/javascript">
var env=${JSON.stringify(env, null, 2)};
</script>
`;
    const regexp = new RegExp('__ENV__');
    const res = content.replace(regexp, text);
    // remove article
    env.article = undefined;
    // ok
    return res;
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
      rmWhitespace: true,
    };
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
        if (fileName && (fileName.indexOf('http://') === 0 || fileName.indexOf('https://') === 0)) return utils.escapeURL(fileName);
        let _path = self.resolvePath('', path.relative(_pathIntermediate, this._filename), fileName);
        _path = _path.replace(/\\/gi, '/');
        const _url = self.getUrl(site, language || site.language.current, _path);
        return utils.escapeURL(_url);
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
        escapeHtml(str) {
          return utils.escapeHtml(str);
        },
        escapeURL(str) {
          return utils.escapeURL(str);
        },
      },
    };
  }


  // //////////////////////////////// build

  // build languages
  async buildLanguages({ progressId, progressNo = 0 }) {
    try {
      // time start
      const timeStart = new Date();
      // site
      const site = await this.combineSiteBase();
      const languages = site.language.items.split(',');

      // progress
      const progress0_Total = languages.length;
      let progress0_progress = 0;

      for (const language of languages) {
        // progress: language
        await this.ctx.meta.progress.update({
          progressId,
          progressNo,
          total: progress0_Total,
          progress: progress0_progress++,
          text: `${this.ctx.text('Build')} ${this.ctx.text(language)}`,
        });

        // build
        await this.buildLanguage({ language, progressId, progressNo: progressNo + 1 });
      }

      // time end
      const timeEnd = new Date();
      const time = (timeEnd.valueOf() - timeStart.valueOf()) / 1000; // second

      // progress: done
      if (progressNo === 0) {
        await this.ctx.meta.progress.done({
          progressId,
          message: `${this.ctx.text('Time Used')}: ${parseInt(time)}${this.ctx.text('second2')}`,
        });
      }

      // ok
      return {
        time,
      };
    } catch (err) {
      // error
      if (progressNo === 0) {
        await this.ctx.meta.progress.error({ progressId, message: err.message });
      }
      throw err;
    }
  }

  // build language
  async buildLanguage({ language, progressId, progressNo = 0 }) {
    try {
      // time start
      const timeStart = new Date();

      // progress
      const progress0_Total = 2;
      let progress0_progress = 0;
      // progress: initialize
      await this.ctx.meta.progress.update({
        progressId,
        progressNo,
        total: progress0_Total,
        progress: progress0_progress++,
        text: this.ctx.text('Initialize'),
      });

      // site
      const site = await this.getSite({ language });

      // / clear

      // intermediate
      const pathIntermediate = await this.getPathIntermediate(language);
      await fse.remove(pathIntermediate);

      // dist
      const pathDist = await this.getPathDist(site, language);
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
      const customPath = await this.getPathCustom(language);
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
          // assets
          const _filename = path.join(pathIntermediate, 'assets');
          const exists = await fse.pathExists(_filename);
          if (exists) {
            await fse.copy(_filename, path.join(pathDist, 'assets'));
          }
        } else {
          // plugins
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
        // delete ejs files
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

      // progress: render files
      await this.ctx.meta.progress.update({
        progressId,
        progressNo,
        total: progress0_Total,
        progress: progress0_progress++,
        text: this.ctx.text('Render Files'),
      });

      // render all files
      await this.renderAllFiles({ language, progressId, progressNo: progressNo + 1 });

      // time end
      const timeEnd = new Date();
      const time = (timeEnd.valueOf() - timeStart.valueOf()) / 1000; // second

      // progress: done
      if (progressNo === 0) {
        await this.ctx.meta.progress.done({
          progressId,
          message: `${this.ctx.text('Time Used')}: ${parseInt(time)}${this.ctx.text('second2')}`,
        });
      }

      // ok
      return {
        time,
      };
    } catch (err) {
      // error
      if (progressNo === 0) {
        await this.ctx.meta.progress.error({ progressId, message: err.message });
      }
      throw err;
    }
  }

  async createSitemapIndex({ site }) {
    // content
    const urlRawRoot = this.getUrlRawRoot(site);
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
    const pathRawDist = await this.getPathRawDist(site);
    await fse.outputFile(`${pathRawDist}/sitemapindex.xml`, content);
  }

  async createRobots({ site }) {
    // content
    const urlRawRoot = this.getUrlRawRoot(site);
    const content =
`User-agent: *
Allow: /

Sitemap: ${urlRawRoot}/sitemapindex.xml
`;
    // write
    const pathRawDist = await this.getPathRawDist(site);
    await fse.outputFile(`${pathRawDist}/robots.txt`, content);
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

  async getArticleUrl({ key }) {
    // article
    const article = await this.ctx.service.article._getArticle({ key, inner: true });
    if (!article) return;
    // site
    const site = await this.getSite({ language: article.language });
    // check if build site first
    const pathIntermediate = await this.getPathIntermediate(article.language);
    const fileName = path.join(pathIntermediate, 'main/article.ejs');
    const exists = await fse.pathExists(fileName);
    if (!exists) this.ctx.throw(1006);
    // url
    return {
      relativeUrl: article.url,
      url: this.getUrl(site, site.language.current, article.url),
    };
  }

  getAtomClassFullName(atomClass) {
    return `${atomClass.module}:${atomClass.atomClassName}:${atomClass.atomClassIdParent}`;
  }

  async getFrontEnvs({ language }) {
    const envs = {};
    for (const module of this.ctx.app.meta.modulesArray) {
      if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.site) {
        // may be more atoms
        for (const key in module.main.meta.base.atoms) {
          // atomClass
          const atomClass = {
            module: module.info.relativeName,
            atomClassName: key,
            atomClassIdParent: 0,
          };
          const atomClassFullName = this.getAtomClassFullName(atomClass);
          if (this.getAtomClassFullName(this.atomClass) !== atomClassFullName) {
            // getSite
            let site;
            try {
              site = await this.ctx.performAction({
                method: 'post',
                url: '/a/cms/site/getSite',
                body: {
                  atomClass,
                  language,
                  options: {
                    envs: false,
                  },
                },
              });
            } catch (e) {
              // nothing
            }
            // set
            if (site) {
              envs[atomClassFullName] = site.front.env;
            }
          }
        }
      }
    }
    return envs;
  }

}

module.exports = {
  create(ctx, atomClass) {
    return new Build(ctx, atomClass);
  },
};



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(4);
const locales = __webpack_require__(5);
const errors = __webpack_require__(8);
const middlewares = __webpack_require__(9);

module.exports = app => {

  // routes
  const routes = __webpack_require__(10)(app);
  // services
  const services = __webpack_require__(23)(app);
  // models
  const models = __webpack_require__(31)(app);
  // meta
  const meta = __webpack_require__(38)(app);

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
/* 4 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    render: {
      path: 'queue/render',
    },
  };

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
    // publishOnSubmit: true,
  };

  // checkFile
  config.checkFile = {
    timeout: 1000,
    timeoutDelay: 5000,
  };

  // site
  config.site = {
    base: {
      title: 'my blog',
      subTitle: 'gone with the wind',
      description: '',
      keywords: '',
      publishOnSubmit: true,
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(6),
  'zh-cn': __webpack_require__(7),
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
  'en-us': 'English',
  'zh-cn': 'Chinese',
  PersonalProfile: 'Profile',
  ArticlePrevious: 'Previous',
  ArticleNext: 'Next',
  second2: 's',
};


/***/ }),
/* 7 */
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
  Sticky: '置顶',
  Initialize: '初始化',
  'Render Files': '渲染文件',
  'Time Used': '用时',
  seconds: '秒',
  second2: '秒',
  Build: '构建',
  Block: '区块',
  'Slug Exists': 'Slug已存在',
  'Build Site First': '请先构建站点',
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Language must not be empty',
  1002: 'Theme not set',
  1003: 'Theme not found',
  1004: 'Cannot delete if has children',
  1005: 'Cannot delete if has articles',
  1006: 'Build Site First',
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const article = __webpack_require__(12);
const category = __webpack_require__(13);
const render = __webpack_require__(14);
const site = __webpack_require__(15);
const tag = __webpack_require__(16);
const comment = __webpack_require__(17);
const rss = __webpack_require__(18);
const queue = __webpack_require__(21);
const event = __webpack_require__(22);

module.exports = app => {
  let routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // article
    { method: 'post', path: 'article/create', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/read', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/select', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/write', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/delete', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/action', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/enable', controller: article, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/list', controller: article },
    { method: 'post', path: 'article/attachments', controller: article },
    // comment
    { method: 'post', path: 'comment/all', controller: comment },
    // render
    { method: 'post', path: 'render/getArticleUrl', controller: render,
      meta: { right: { type: 'atom', action: 2 } },
    },
    // site
    { method: 'post', path: 'site/getSite', controller: site, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'site/getConfigSiteBase', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigSite', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigSite', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguagePreview', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguage', controller: site, middlewares: 'progress', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguages', controller: site, middlewares: 'progress', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getLanguages', controller: site },
    { method: 'post', path: 'site/getUrl', controller: site },
    { method: 'post', path: 'site/getBlocks', controller: site },
    { method: 'post', path: 'site/getBlockArray', controller: site },
    { method: 'post', path: 'site/blockSave', controller: site },
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
    { method: 'get', path: 'rss/feed/:module/:atomClassName/:language', controller: rss, action: 'feed' },
    { method: 'get', path: 'rss/feed/comments/:module/:atomClassName/:language', controller: rss, action: 'feedComments' },
    { method: 'get', path: 'rss/feed/article/comments/:atomId', controller: rss, action: 'articleComments' },
    // queue
    { method: 'post', path: 'queue/render', controller: queue, middlewares: 'inner,progress',
      meta: { auth: { enable: false } },
    },
    // event
    { method: 'post', path: 'event/atomClassValidator', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },
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
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');
const utils = __webpack_require__(1);

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
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // user
      const user = this.ctx.user.op;
      // select
      // filter drafts
      options.where = extend(true, options.where, {
        'a.atomEnabled': 1, // normal mode
        'a.atomFlag': 2, // published
      });
      // select
      options.page = this.ctx.meta.util.page(options.page, false);
      const items = await this.ctx.meta.atom.select({ atomClass, options, user, pageForce: false });
      // ok
      this.ctx.successMore(items, options.page.index, options.page.size);
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
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class CategoryController extends app.Controller {

    async item() {
      // need not param:atomClass
      const data = await this.ctx.service.category.item({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(data);
    }

    async save() {
      // need not param:atomClass
      const res = await this.ctx.service.category.save({
        categoryId: this.ctx.request.body.categoryId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async tree() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.category.tree({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async children() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.category.children({
        atomClass,
        language: this.ctx.request.body.language,
        categoryId: this.ctx.request.body.categoryId,
        hidden: this.ctx.request.body.hidden,
        flag: this.ctx.request.body.flag,
      });
      this.ctx.success({ list });
    }

    async add() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.category.add({
        atomClass,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async delete() {
      // need not param:atomClass
      const res = await this.ctx.service.category.delete({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

    async move() {
      // need not param:atomClass
      const res = await this.ctx.service.category.move({
        categoryId: this.ctx.request.body.categoryId,
        categoryIdParent: this.ctx.request.body.categoryIdParent,
      });
      this.ctx.success(res);
    }

    async relativeTop() {
      // need not param:atomClass
      const res = await this.ctx.service.category.relativeTop({
        categoryId: this.ctx.request.body.categoryId,
      });
      this.ctx.success(res);
    }

  }
  return CategoryController;
};



/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class RenderController extends app.Controller {

    async getArticleUrl() {
      const res = await this.ctx.service.render.getArticleUrl({
        atomClass: this.ctx.request.body.atomClass,
        key: this.ctx.request.body.key,
      });
      this.ctx.success(res);
    }

  }
  return RenderController;
};



/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(1);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SiteController extends app.Controller {

    async getSite() {
      const atomClass = this.ctx.request.body.atomClass;
      const site = await this.ctx.service.site.getSite({
        atomClass,
        language: this.ctx.request.body.language,
        options: this.ctx.request.body.options,
      });
      this.ctx.success(site);
    }

    async getConfigSiteBase() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigSiteBase({ atomClass });
      this.ctx.success({ data });
    }

    async getConfigSite() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigSite({ atomClass });
      this.ctx.success({ data });
    }

    async setConfigSite() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.setConfigSite({
        atomClass,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async getConfigLanguagePreview() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigLanguagePreview({
        atomClass,
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async getConfigLanguage() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigLanguage({
        atomClass,
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async setConfigLanguage() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.setConfigLanguage({
        atomClass,
        language: this.ctx.request.body.language,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async buildLanguage() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      const language = this.ctx.request.body.language;
      // progress
      const progressId = await this.ctx.meta.progress.create();
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguage',
          atomClass,
          language,
          progressId,
        },
      });
      this.ctx.success({ progressId });
    }

    async buildLanguages() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // progress
      const progressId = await this.ctx.meta.progress.create();
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguages',
          atomClass,
          progressId,
        },
      });
      this.ctx.success({ progressId });
    }

    async getLanguages() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getLanguages({ atomClass });
      this.ctx.success(res);
    }

    async getUrl() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getUrl({
        atomClass,
        language: this.ctx.request.body.language,
        path: this.ctx.request.body.path,
      });
      this.ctx.success(res);
    }

    async checkFile() {
      const res = await this.ctx.service.site.checkFile({
        file: this.ctx.request.body.file,
        mtime: this.ctx.request.body.mtime,
      });
      this.ctx.success(res);
    }

    async getBlocks() {
      const res = await this.ctx.service.site.getBlocks({
        locale: this.ctx.locale,
      });
      this.ctx.success(res);
    }

    async getBlockArray() {
      const res = await this.ctx.service.site.getBlockArray({
        locale: this.ctx.locale,
      });
      this.ctx.success(res);
    }

    async blockSave() {
      const res = await this.ctx.service.site.blockSave({
        blockName: this.ctx.request.body.blockName,
        item: this.ctx.request.body.item,
      });
      this.ctx.success(res);
    }

  }
  return SiteController;
};



/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {

  class TagController extends app.Controller {

    async list() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.tag.list({
        atomClass,
        options: this.ctx.request.body.options,
      });
      this.ctx.success({ list });
    }

  }
  return TagController;
};



/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');
const utils = __webpack_require__(1);

module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
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
          atomClass,
          options,
        },
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const Build = __webpack_require__(2);

module.exports = app => {

  class RSSController extends app.Controller {

    async feed() {
      // params
      //   module
      const module = this.ctx.params.module;
      //   atomClassName
      const atomClassName = this.ctx.params.atomClassName;
      //   language
      const language = this.ctx.params.language;
      // atomClass
      const atomClass = { module, atomClassName };
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
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = Build.create(this.ctx, atomClass);
      // site
      const site = await build.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[${site.base.title}]]></title>
    <link>${build.getUrl(site, language, 'index.html')}</link>
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
        ${build.getUrl(site, language, article.url)}
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
      // params
      //   module
      const module = this.ctx.params.module;
      //   atomClassName
      const atomClassName = this.ctx.params.atomClassName;
      //   language
      const language = this.ctx.params.language;
      // atomClass
      const atomClass = { module, atomClassName };
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
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = Build.create(this.ctx, atomClass);
      // site
      const site = await build.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments for ${site.base.title}]]></title>
    <link>${build.getUrl(site, language, 'index.html')}</link>
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
        ${build.getUrl(site, language, item.url)}#comments
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
      const article = await this.ctx.service.article._getArticle({ key: { atomId }, inner: false });
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
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ id: article.atomClassId });
      // build
      const build = Build.create(this.ctx, atomClass);
      // site
      const site = await build.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments on: ${article.atomName}]]></title>
    <link>${build.getUrl(site, language, article.url)}</link>
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
        ${build.getUrl(site, language, article.url)}#comments
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
/* 19 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, exports) {

module.exports = app => {

  class QueueController extends app.Controller {

    async render() {
      const queueAction = this.ctx.request.body.queueAction;
      await this[queueAction]();
    }

    async buildLanguage() {
      const res = await this.ctx.service.site.buildLanguage({
        atomClass: this.ctx.request.body.atomClass,
        language: this.ctx.request.body.language,
        progressId: this.ctx.request.body.progressId,
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      const res = await this.ctx.service.site.buildLanguages({
        atomClass: this.ctx.request.body.atomClass,
        progressId: this.ctx.request.body.progressId,
      });
      this.ctx.success(res);
    }

    async renderArticle() {
      const res = await this.ctx.service.render.renderArticle({
        atomClass: this.ctx.request.body.atomClass,
        key: this.ctx.request.body.key,
        inner: this.ctx.request.body.inner,
      });
      this.ctx.success(res);
    }

    async deleteArticle() {
      const res = await this.ctx.service.render.deleteArticle({
        atomClass: this.ctx.request.body.atomClass,
        key: this.ctx.request.body.key,
        article: this.ctx.request.body.article,
        inner: this.ctx.request.body.inner,
      });
      this.ctx.success(res);
    }

  }

  return QueueController;
};


/***/ }),
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(24);
const article = __webpack_require__(25);
const category = __webpack_require__(26);
const render = __webpack_require__(27);
const site = __webpack_require__(28);
const tag = __webpack_require__(29);
const event = __webpack_require__(30);

module.exports = app => {
  const services = {
    version,
    article,
    category,
    render,
    site,
    tag,
    event,
  };
  return services;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const uuid = require3('uuid');
const utils = __webpack_require__(1);

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
            content LONGTEXT DEFAULT NULL,
            html LONGTEXT DEFAULT NULL,
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

      if (options.version === 5) {
        // alter table: aCmsCategory
        let sql = `
        ALTER TABLE aCmsCategory
          ADD COLUMN atomClassId int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);
        // alter table: aCmsTag
        sql = `
        ALTER TABLE aCmsTag
          ADD COLUMN atomClassId int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 6) {
        // alter table: aCmsArticle
        let sql = `
        ALTER TABLE aCmsArticle
          ADD COLUMN uuid varchar(50) DEFAULT NULL
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

    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-writer cms-publisher to template
        const roles = [ 'cms-writer', 'cms-publisher' ];
        const roleTemplate = await this.ctx.meta.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.meta.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.meta.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-writer cms-publisher
          await this.ctx.meta.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.meta.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-writer', action: 'create' },
          { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'publish', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
        ];
        await this.ctx.meta.role.addRoleRightBatch({ atomClassName: 'article', roleRights });

      }

      if (options.version === 5) {
        // atomClass
        const atomClass = await utils.atomClass2(this.ctx, null);
        // update aCmsCategory's atomClassId
        await this.ctx.model.query(
          `update aCmsCategory set atomClassId=?
             where iid=?`,
          [ atomClass.id, this.ctx.instance.id ]);
        // update aCmsTag's atomClassId
        await this.ctx.model.query(
          `update aCmsTag set atomClassId=?
             where iid=?`,
          [ atomClass.id, this.ctx.instance.id ]);
      }

      if (options.version === 6) {
        // uuid
        const articles = await this.ctx.model.article.select();
        for (const article of articles) {
          const uuid = this._parseUuid(article);
          await this.ctx.model.article.update({
            id: article.id,
            uuid,
          });
        }
      }

    }

    async test() {

    }

    _parseUuid(article) {
      if (!article.url) return this._uuid();
      const matches = article.url.match(/articles\/(.*)\.html/);
      if (!matches) return this._uuid();
      if (matches[1].length !== 32) return this._uuid();
      return matches[1];
    }

    _uuid() {
      return uuid.v4().replace(/-/g, '');
    }

  }

  return Version;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Article extends app.Service {

    async create({ atomClass, key, item, user }) {
      const site = await this.ctx.service.render.combineSiteBase({ atomClass });
      const editMode = site.edit.mode;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
      if (item.language) params.language = item.language;
      if (item.categoryId) params.categoryId = item.categoryId;
      // uuid
      params.uuid = item.uuid || uuid.v4().replace(/-/g, '');
      // insert
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

    _getMeta(item, showSorting) {
      // flags
      const flags = [];
      if (item.sticky) flags.push(this.ctx.text('Sticky'));
      if (item.sorting && showSorting) flags.push(item.sorting);
      // meta
      const meta = {
        summary: item.summary,
        flags,
      };
      // ok
      item._meta = meta;
    }

    async read({ atomClass, key, item, user }) {
      // read
      this._getMeta(item, false);
    }

    async select({ atomClass, options, items, user }) {
      const showSorting = options && options.where && options.where.categoryId;
      // select
      for (const item of items) {
        this._getMeta(item, showSorting);
      }
    }

    async write({ atomClass, key, item, user }) {
      // get atom for safety
      const atomOld = await this.ctx.meta.atom.read({ key, user });
      // if undefined then old
      const fields = [ 'slug', 'editMode', 'content', 'language', 'categoryId', 'sticky', 'keywords', 'description', 'sorting', 'flag', 'extra' ];
      for (const field of fields) {
        if (item[field] === undefined) item[field] = atomOld[field];
      }

      // url
      let url;
      if (item.slug) {
        url = `articles/${item.slug}.html`;
      } else {
        url = `articles/${atomOld.uuid}.html`;
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
        const matches = item.content && item.content.match(/\$\$\$\s*audio([\s\S]*?)\$\$\$/);
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
      // markdown-it-block
      const blocks = this.ctx.service.site.getBlocks({ locale: item.language });
      // block options
      const blockOptions = {
        utils: {
          text: (...args) => {
            return this.ctx.text.locale(item.language, ...args);
          },
        },
        blocks,
      };
      md.use(markdonw_it_block, blockOptions);
      // html
      let html;
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
      const tagsNew = await this.ctx.service.tag.updateArticleTags({ atomClass, key, item });

      // set tag count , force check if delete tags
      // if (atomOld.atomFlag === 2) {
      await this.ctx.service.tag.setTagArticleCount({ tagsNew, tagsOld: atomOld.tags });
      // }

      // render
      await this._renderArticle({ atomClass, key, inner: atomOld.atomFlag !== 2 });
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
      await this._deleteArticle({ atomClass, key, article: atomOld, inner: atomOld.atomFlag !== 2 });
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
        await this._renderArticle({ atomClass, key, inner: false });
      } else {
        // other custom action
        //   always render again
        await this._renderArticle({ atomClass, key, inner: false });
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
      // site
      const site = await this.ctx.service.render.combineSiteBase({ atomClass });
      // if (this.ctx.config.article.publishOnSubmit) {
      if (site.base.publishOnSubmit !== false) {
        // publish
        await this.action({ action: 101, atomClass, key, user });
      }
    }

    async _deleteArticle({ atomClass, key, article, inner }) {
      this.ctx.tail(async () => {
        // queue not async
        await this.ctx.app.meta.queue.push({
          locale: this.ctx.locale,
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass, key, article, inner,
          },
        });
      });
    }

    async _renderArticle({ atomClass, key, inner }) {
      this.ctx.tail(async () => {
        // queue not async
        await this.ctx.app.meta.queue.push({
          locale: this.ctx.locale,
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass, key, inner,
          },
        });
      });
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

  }

  return Article;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(1);

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

    async children({ atomClass, language, categoryId, hidden, flag }) {
      //
      const where = {
        categoryIdParent: categoryId || 0,
      };
      // atomClassId
      if (where.categoryIdParent === 0) {
        const _atomClass = await utils.atomClass2(this.ctx, atomClass);
        where.atomClassId = _atomClass.id;
      }
      //
      if (language !== undefined) where.language = language;
      if (hidden !== undefined) where.hidden = hidden;
      if (flag !== undefined) where.flag = flag;
      const list = await this.ctx.model.category.select({
        where,
        orders: [[ 'sorting', 'asc' ], [ 'createdAt', 'asc' ]],
      });
      return list;
    }

    async add({ atomClass, data }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      // add
      const res = await this.ctx.model.category.insert({
        categoryName: data.categoryName,
        language: data.language,
        catalog: 0,
        hidden: 0,
        sorting: 0,
        categoryIdParent: data.categoryIdParent,
        atomClassId: _atomClass.id,
      });
      // adjust catalog
      await this.adjustCatalog(data.categoryIdParent);

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

    // for donothing on categoryId === 0, so need not input param:atomClass
    async adjustCatalog(categoryId) {
      if (categoryId === 0) return;
      const children = await this.children({ categoryId });
      await this.ctx.model.category.update({
        id: categoryId,
        catalog: children.length === 0 ? 0 : 1,
      });
    }

    async tree({ atomClass, language, categoryId, hidden, flag }) {
      return await this._treeChildren({ atomClass, language, categoryId, hidden, flag });
    }

    async _treeChildren({ atomClass, language, categoryId, hidden, flag }) {
      const list = await this.children({ atomClass, language, categoryId, hidden, flag });
      for (const item of list) {
        if (item.catalog) {
          // only categoryId
          item.children = await this._treeChildren({ atomClass, categoryId: item.id });
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const Build = __webpack_require__(2);

module.exports = app => {

  class Render extends app.Service {

    async renderArticle({ atomClass, key, inner }) {
      const build = Build.create(this.ctx, atomClass);
      await build.renderArticle({ key, inner });
    }

    async deleteArticle({ atomClass, key, article, inner }) {
      const build = Build.create(this.ctx, atomClass);
      await build.deleteArticle({ key, article, inner });
    }

    async getArticleUrl({ atomClass, key }) {
      if (!atomClass) {
        atomClass = await this.ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = Build.create(this.ctx, atomClass);
      return await build.getArticleUrl({ key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.combineSiteBase();
    }

  }

  return Render;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const fse = require3('fs-extra');
const extend = require3('extend2');
const Build = __webpack_require__(2);

const _blocksLocales = {};
const _blockArrayLocales = {};

module.exports = app => {

  class Site extends app.Service {

    async getSite({ atomClass, language, options }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getSite({ language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigSite();
    }

    async setConfigSite({ atomClass, data }) {
      const build = Build.create(this.ctx, atomClass);
      await build.setConfigSite({ data });
    }

    async getConfigLanguagePreview({ atomClass, language }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigLanguagePreview({ language });
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigLanguage({ language });
    }

    async setConfigLanguage({ atomClass, language, data }) {
      const build = Build.create(this.ctx, atomClass);
      await build.setConfigLanguage({ language, data });
    }

    async getLanguages({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getLanguages();
    }

    async getUrl({ atomClass, language, path }) {
      const build = Build.create(this.ctx, atomClass);
      const site = await build.getSite({ language });
      return build.getUrl(site, language, path);
    }

    async buildLanguages({ atomClass, progressId }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguages({ progressId });
    }

    async buildLanguage({ atomClass, language, progressId }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguage({ language, progressId });
    }

    async checkFile({ file, mtime }) {
      // loop
      const timeStart = new Date();
      while (true) {
        // exists
        const exists = await fse.pathExists(file);
        if (!exists) {
          // deleted
          return null;
        }
        // stat
        const stat = await fse.stat(file);
        const mtimeCurrent = stat.mtime.valueOf();
        if (mtime !== mtimeCurrent) {
          // different
          return { mtime: mtimeCurrent };
        }
        // check the delayTimeout if the same
        const timeEnd = new Date();
        const time = (timeEnd.valueOf() - timeStart.valueOf());
        if (time >= this.ctx.config.checkFile.timeoutDelay) {
          // timeout
          return { mtime: mtimeCurrent };
        }
        // sleep 1s then continue
        await this.ctx.meta.util.sleep(1000);
      }
    }

    getBlocks({ locale }) {
      if (!_blocksLocales[locale]) {
        const blocks = this._prepareBlocks({ locale });
        // object
        _blocksLocales[locale] = blocks;
        // array order by titleLocale
        const blockArray = [];
        for (const key in blocks) {
          blockArray.push(blocks[key]);
        }
        _blockArrayLocales[locale] = blockArray.sort((a, b) => a.meta.titleLocale.localeCompare(b.meta.titleLocale, locale));
      }
      return _blocksLocales[locale];
    }

    getBlockArray({ locale }) {
      this.getBlocks({ locale });
      return _blockArrayLocales[locale];
    }

    async blockSave({ blockName, item }) {
      // block
      const blocks = this.getBlocks({ locale: this.ctx.locale });
      const block = blocks[blockName];
      // validate
      await this.ctx.meta.validation.validate({
        module: block.meta.module,
        validator: block.meta.validator,
        schema: null,
        data: item,
      });
      // output
      if (!block.data.output) return item;
      return await block.data.output({ ctx: this.ctx, block, data: item });
    }

    _prepareBlocks({ locale }) {
      const blocks = {};
      // modulesArray for block override
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.cms &&
          module.main.meta.cms.plugin && module.main.meta.cms.plugin.blocks) {
          const blocksModule = this._prepareBlocksModule({ locale, module, blocks: module.main.meta.cms.plugin.blocks });
          Object.assign(blocks, blocksModule);
        }
      }
      return blocks;
    }

    _prepareBlocksModule({ locale, module, blocks }) {
      const blocksModule = extend(true, {}, blocks);
      for (const key in blocksModule) {
        const block = blocksModule[key];
        block.meta.module = module.info.relativeName;
        block.meta.titleLocale = this.ctx.text.locale(locale, block.meta.title);
      }
      return blocksModule;
    }

  }

  return Site;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(1);

module.exports = app => {

  class Tag extends app.Service {

    async list({ atomClass, options }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      if (!options.where) options.where = {};
      options.where.atomClassId = _atomClass.id;
      return await this.ctx.model.tag.select(options);
    }

    async create({ atomClassId, language, tagName }) {
      // check if exists
      const tag = await this.ctx.model.tag.get({
        atomClassId, language, tagName,
      });
      if (tag) return tag.id;
      // insert
      const res = await this.ctx.model.tag.insert({
        atomClassId, language, tagName, articleCount: 0,
      });
      return res.insertId;
    }

    async updateArticleTags({ atomClass, key, item }) {
      const _atomClass = await utils.atomClass2(this.ctx, atomClass);
      // tags
      let tags = null;
      if (item.tags) {
        tags = JSON.parse(item.tags);
        for (const tag of tags) {
          if (tag.id === 0) {
            tag.id = await this.create({ atomClassId: _atomClass.id, language: item.language, tagName: tag.name });
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
          // check if referenced by items of deleted or other flag status
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
/* 30 */
/***/ (function(module, exports) {

module.exports = app => {

  class Event extends app.Service {

    async atomClassValidator({ event, data: { atomClass, user } }) {
      // donothing
    }

  }

  return Event;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const article = __webpack_require__(32);
const category = __webpack_require__(33);
const content = __webpack_require__(34);
const tag = __webpack_require__(35);
const articleTag = __webpack_require__(36);
const articleTagRef = __webpack_require__(37);

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
/* 32 */
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
/* 33 */
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
/* 34 */
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
/* 35 */
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
/* 36 */
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
/* 37 */
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const keywords = __webpack_require__(39)(app);
  const schemas = __webpack_require__(40)(app);
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
          orders: [
            { name: 'sticky', title: 'Sticky', by: 'desc' },
            { name: 'sorting', title: 'Sorting', by: 'asc' },
          ],
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
      keywords: {
        'x-slug': keywords.slug,
      },
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
    event: {
      implementations: {
        // 'a-base:atomClassValidator': 'event/atomClassValidator',
      },
    },
  };
  return meta;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.slug = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data, path, rootData, name) {
        // ignore if empty
        if (!data) return true;
        // unique slug for language and atomClass
        const ctx = this;
        //   atomClass from atomId
        const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: rootData.atomId });
        //   read by atomClass, language, slug
        const items = await ctx.model.query(`
          select a.id from aAtom a
            left join aCmsArticle b on a.id=b.atomId
              where a.iid=? and a.deleted=0 and a.atomClassId=? and b.language=? and b.slug=?
          `, [ ctx.instance.id, atomClass.id, rootData.language, data ]);
        if (items[0] && items[0].id !== rootData.atomId) {
          const errors = [{ keyword: 'x-slug', params: [], message: ctx.text('Slug Exists') }];
          throw new Ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),
/* 40 */
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
      atomId: {
        type: 'number',
      },
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
        'x-slug': true,
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