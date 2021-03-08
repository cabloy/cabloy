module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 43:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // article
      const site = await this.ctx.service.render.combineSiteBase({ atomClass, mergeConfigSite: true });
      const editMode = site.edit.mode;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
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

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // read: showSorting=true
      this._getMeta(item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // select
      const showSorting = options && options.category;
      for (const item of items) {
        this._getMeta(item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      const atomStage = item.atomStage;
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // if undefined then old
      const fields = [ 'atomLanguage', 'slug', 'editMode', 'content', 'sticky', 'keywords', 'description', 'sorting', 'flag', 'extra' ];
      for (const field of fields) {
        if (item[field] === undefined) item[field] = atomOld[field];
      }
      // clone
      if (target === 'clone') {
        item.slug = null; // clear slug
      }
      // url
      let url;
      const draftExt = atomStage === 0 ? '.draft' : '';
      if (item.slug) {
        url = `articles/${item.slug}${draftExt}.html`;
      } else {
        url = `articles/${atomOld.uuid}${draftExt}.html`;
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
        const matches = item.content && item.content.match(/\$\$\$\s*cms-pluginblock:blockAudio([\s\S]*?)\$\$\$/);
        let options = matches && matches[1];
        if (options) {
          options = global.JSON5.parse(options);
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
      const blocks = this.ctx.service.site.getBlocks();
      // block options
      const blockOptions = {
        utils: {
          text: (...args) => {
            return this.ctx.text.locale(item.atomLanguage, ...args);
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

      // render
      const ignoreRender = options && options.ignoreRender;
      if (!ignoreRender) {
        if (atomStage === 0) {
          await this._renderArticle({ atomClass, key, inner: true });
        }
        if (atomStage === 1) {
          await this._renderArticle({ atomClass, key, inner: false });
        }
      }
    }

    async delete({ atomClass, key, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });

      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.content.delete({
        itemId: key.itemId,
      });

      // delete article
      if (atomOld.atomStage === 0) {
        await this._deleteArticle({ atomClass, key, article: atomOld, inner: true });
      }
      if (atomOld.atomStage === 1) {
        await this._deleteArticle({ atomClass, key, article: atomOld, inner: false });
      }

      // super
      await super.delete({ atomClass, key, user });
    }

    async submit({ atomClass, key, options, user }) {
      // super
      return await super.submit({ atomClass, key, options, user });
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

    async _deleteArticle({ atomClass, key, article, inner }) {
      this.ctx.tail(async () => {
        // queue
        await this.ctx.app.meta.queue.pushAsync({
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
        // queue
        await this.ctx.app.meta.queue.pushAsync({
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
        const roleAnonymous = await this.ctx.bean.role.getSystemRole({ roleName: 'anonymous' });
        const right = await this.ctx.bean.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return null;
      }
      // article
      const article = await this.ctx.bean.atom.read({ key, user: { id: 0 } });
      if (!article) return null;
      // check atomLanguage
      if (!article.atomLanguage) {
        article.atomLanguage = this.ctx.locale;
        // return null;
        // this.ctx.throw(1001);
      }
      return article;
    }

  }

  return Atom;
};


/***/ }),

/***/ 762:
/***/ ((module) => {

module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {
  }
  return IOMessage;
};


/***/ }),

/***/ 375:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(622);
const require3 = __webpack_require__(718);
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
const less = require3('less');
const time = __webpack_require__(798);
const utils = __webpack_require__(294);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Build extends app.meta.BeanBase {

    constructor(ctx, atomClass) {
      super(ctx);
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
      return await this.ctx.bean.status.get(name);
    }

    async setConfigSite({ data }) {
      const name = this.default ? 'config-site' : `config-site:${this.atomClass.module}`;
      await this.ctx.bean.status.set(name, data);
    }

    async getConfigLanguage({ language }) {
      const name = this.default ? `config-${language}` : `config-${language}:${this.atomClass.module}`;
      return await this.ctx.bean.status.get(name);
    }

    async setConfigLanguage({ language, data }) {
      const name = this.default ? `config-${language}` : `config-${language}:${this.atomClass.module}`;
      this._adjustConfigLanguange(data);
      await this.ctx.bean.status.set(name, data);
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
    async combineSiteBase(options) {
      const mergeConfigSite = options && options.mergeConfigSite;
      // site
      let site = await this.getConfigSiteBase();
      // site(db) special for language/themes
      const configSite = await this.getConfigSite();
      if (configSite) {
        if (mergeConfigSite) {
          site = extend(true, site, configSite);
        } else {
          if (configSite.language) site.language = configSite.language;
          if (configSite.themes) site.themes = configSite.themes;
        }
      }
      return site;
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSite({ siteBase, language }) {
      // themeModuleName
      const themeModuleName = siteBase.themes[language];
      if (!themeModuleName) {
        this.ctx.throw(1002, this.atomClass.module, this.atomClass.atomClassName, language);
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
      if (!module) this.ctx.throw(1003, themeModuleName);
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
        const publicDir = this.ctx.app.config.static.prefix + 'public/';
        const prefix = this.ctx.bean.base.host ? `${this.ctx.bean.base.protocol}://${this.ctx.bean.base.host}` : '';
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
      return this.ctx.bean.base.getAbsoluteUrl(path);
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
      return await this.ctx.bean.base.getPath(this.getCMSPathName());
    }
    async getPathRawDist() {
      // cms/dist
      return await this.ctx.bean.base.getPath(`${this.getCMSPathName()}/dist`);
    }

    // ///////////////////////////////// render

    async renderAllFiles({ language, progressId, progressNo }) {
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language });
      site.render = { scene: 'all' };
      // render static
      await this._renderStatic({ site });
      // render articles
      await this._renderArticles({ site, progressId, progressNo });
      // render index
      await this._renderIndex({ site });
    }

    async renderArticle({ key, inner }) {
      // article
      const article = await this.ctx.bean._getBean(`${moduleInfo.relativeName}.atom.article`)._getArticle({ key, inner });
      if (!article) return;
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language: article.atomLanguage });
      // check if build site first
      const siteBuilt = await this._checkIfSiteBuilt({ site });
      if (!siteBuilt) return; // not throw error
      // render scene
      site.render = { scene: 'single', inner };
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
      // maybe not rendered
      if (!article.url) return;
      // same logic with renderArticle
      if (!article.atomLanguage) {
        article.atomLanguage = this.ctx.locale;
      }
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language: article.atomLanguage });
      // check if build site first
      const siteBuilt = await this._checkIfSiteBuilt({ site });
      if (!siteBuilt) return; // not throw error
      // remove file
      const pathDist = await this.getPathDist(site, article.atomLanguage);
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
      const user = await this.ctx.bean.user.anonymous();
      // articles
      const articles = await this.ctx.bean.atom.select({
        atomClass: this.atomClass,
        options: {
          language: site.language.current,
          orders: [[ 'a.updatedAt', 'desc' ]],
          page: null,
          mode: 'search',
          stage: 'formal',
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
        if (progressId) {
          await this.ctx.bean.progress.update({
            progressId,
            progressNo,
            total: progress1_Total,
            progress: progress1_progress++,
            text: article.atomName,
          });
        }
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
        let _fileDest = _fileSrc.substr('main/index/'.length).replace('.ejs', '');
        if (_fileDest.indexOf('.') === -1) {
          _fileDest = `${_fileDest}.html`;
        }
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
        let _fileDest = _fileSrc.replace('.ejs', '');
        if (_fileDest.indexOf('.') === -1) {
          _fileDest = `${_fileDest}.html`;
        }
        await this._renderFile({
          fileSrc: _fileSrc,
          fileDest: _fileDest,
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
      // destFile for hot load
      let hotloadFile;
      if ((this.app.meta.isTest || this.app.meta.isLocal) && fileDest.indexOf('.html') > -1) {
        hotloadFile = fileWrite;
        data.env('site.hotloadFile', hotloadFile);
      }
      // load src
      let contentSrc = await fse.readFile(fileName);
      contentSrc = contentSrc ? contentSrc.toString() : '';
      // load includes of plugins
      const pluginIncludes = await this._loadPluginIncludes({ site, language });
      contentSrc = `${pluginIncludes}\n${contentSrc}`;
      // render
      const options = this.getOptions();
      options.filename = fileName;
      let content = await ejs.render(contentSrc, data, options);
      content = await this._renderEnvs({ data, content });
      content = await this._renderCSSJSes({ data, content });
      // write
      await fse.outputFile(fileWrite, content);
      // alternative url
      if (fileDestAlt && fileDestAlt !== fileDest) {
        const fileWriteAlt = path.join(pathDist, fileDestAlt);
        await fse.outputFile(fileWriteAlt, content);
      }
      // socketio publish
      if (hotloadFile) {
        await this._socketioPublish({ hotloadFile });
      }
    }

    async _socketioPublish({ hotloadFile }) {
      const message = {
        userIdTo: -1,
        content: {
          mtime: new Date(),
        },
      };
      await this.ctx.bean.io.publish({
        path: `/a/cms/hotloadFile/${hotloadFile}`,
        message,
        messageClass: {
          module: 'a-cms',
          messageClassName: 'hotloadFile',
        },
      });
    }

    _checkIfPluginEnable({ site, moduleName }) {
      const config = site.plugins[moduleName];
      return !config || config.enable !== false;
    }

    async _loadPluginIncludes({ site, language }) {
      // if exists
      if (site._pluginIncludes) return site._pluginIncludes;
      // modulesArray
      let pluginIncludes = '';
      for (const module of this.app.meta.modulesArray) {
        if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.plugin
        && this._checkIfPluginEnable({ site, moduleName: module.info.relativeName })
        ) {
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
            _content = _content ? _content.toString() : '';
          }
          // minify
          if (type === 'CSS') {
            let _needMinify = false;
            if (item.indexOf('.less') > -1) {
            // less
              const output = await less.render(_content, { filename: item });
              _content = output.css;
              _needMinify = true;
            } else if (item.indexOf('.min.css') === -1) {
            // normal
              _needMinify = true;
            }
            if (_needMinify) {
            // minify
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
        text(...args) {
          return this.ctx.text.locale(site.language.current, ...args);
        },
        util: {
          time,
          formatDateTime(date) {
            return this.time.formatDateTime(date, `${site.env.format.date} ${site.env.format.time}`);
          },
          safeHtml(str) {
            return self.ctx.helper.shtml(str);
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
          if (progressId) {
            await this.ctx.bean.progress.update({
              progressId,
              progressNo,
              total: progress0_Total,
              progress: progress0_progress++,
              text: `${this.ctx.text('Build')} ${this.ctx.text(language)}`,
            });
          }

          // build
          await this.buildLanguage({ language, progressId, progressNo: progressNo + 1 });
        }

        // time end
        const timeEnd = new Date();
        const time = (timeEnd.valueOf() - timeStart.valueOf()) / 1000; // second

        // progress: done
        if (progressId) {
          if (progressNo === 0) {
            await this.ctx.bean.progress.done({
              progressId,
              message: `${this.ctx.text('Time Used')}: ${parseInt(time)}${this.ctx.text('second2')}`,
            });
          }
        }

        // ok
        return {
          time,
        };
      } catch (err) {
        // error
        if (progressId) {
          if (progressNo === 0) {
            await this.ctx.bean.progress.error({ progressId, message: err.message });
          }
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
        if (progressId) {
          await this.ctx.bean.progress.update({
            progressId,
            progressNo,
            total: progress0_Total,
            progress: progress0_progress++,
            text: this.ctx.text('Initialize'),
          });
        }

        // site
        const site = await this.getSite({ language });

        // / clear

        // intermediate
        const pathIntermediate = await this.getPathIntermediate(language);
        await fse.remove(pathIntermediate);

        // dist
        const pathDist = await this.getPathDist(site, language);
        //   solution: 1
        // const distPaths = [ 'articles', 'assets', 'plugins', 'static', 'index.html', 'robots.txt', 'sitemap.xml', 'sitemapindex.xml' ];
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
        if (!site.themes[language]) this.ctx.throw(1002, this.atomClass.module, this.atomClass.atomClassName, language);
        await this.copyThemes(pathIntermediate, site.themes[language]);

        // custom
        const customPath = await this.getPathCustom(language);
        const customFiles = await bb.fromCallback(cb => {
          glob(`${customPath}/\*`, cb);
        });
        for (const item of customFiles) {
          await fse.copy(item, path.join(pathIntermediate, path.basename(item)));
        }

        // intermediate dist
        const intermediateDistFiles = await bb.fromCallback(cb => {
          glob(`${pathIntermediate}/dist/\*`, cb);
        });
        for (const item of intermediateDistFiles) {
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
        if (progressId) {
          await this.ctx.bean.progress.update({
            progressId,
            progressNo,
            total: progress0_Total,
            progress: progress0_progress++,
            text: this.ctx.text('Render Files'),
          });
        }

        // render all files
        await this.renderAllFiles({ language, progressId, progressNo: progressNo + 1 });

        // time end
        const timeEnd = new Date();
        const time = (timeEnd.valueOf() - timeStart.valueOf()) / 1000; // second

        // progress: done
        if (progressId) {
          if (progressNo === 0) {
            await this.ctx.bean.progress.done({
              progressId,
              message: `${this.ctx.text('Time Used')}: ${parseInt(time)}${this.ctx.text('second2')}`,
            });
          }
        }

        // ok
        return {
          time,
        };
      } catch (err) {
        // error
        if (progressId) {
          if (progressNo === 0) {
            await this.ctx.bean.progress.error({ progressId, message: err.message });
          }
        }
        throw err;
      }
    }

    // register watchers
    async registerWatchers() {
      // info
      const watcherInfos = [];
      // site
      const site = await this.combineSiteBase();
      const languages = site.language.items.split(',');
      // loop languages
      for (const language of languages) {
      // info
        const watcherInfo = await this._collectWatcher({ language });
        watcherInfos.push(watcherInfo);
      }
      // register
      this.app.meta['a-cms:watcher'].registerLanguages({
        info: {
          subdomain: this.ctx.subdomain,
          atomClass: this.atomClass,
        },
        watcherInfos,
      });
    }

    async registerWatcher({ language }) {
      // info
      const watcherInfo = await this._collectWatcher({ language });
      // register
      this.app.meta['a-cms:watcher'].register(watcherInfo);
    }

    async _collectWatcher({ language }) {
      // site
      const site = await this.getSite({ language });

      // watcher
      site._watchers = [];

      // / files
      // /  plugins<theme<custom

      // plugins
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (!module.info.public && module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.plugin) {
          site._watchers.push(path.join(module.root, 'backend/cms'));
        // site._watchers.push(path.join(module.root, 'backend/src'));
        }
      }

      // theme
      if (!site.themes[language]) this.ctx.throw(1002, this.atomClass.module, this.atomClass.atomClassName, language);
      this.watcherThemes(site, site.themes[language]);

      // custom
      const customPath = await this.getPathCustom(language);
      site._watchers.push(customPath);

      // watcherInfo
      return {
        subdomain: this.ctx.subdomain,
        atomClass: this.atomClass,
        language,
        watchers: site._watchers,
      };
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
      if (!module) this.ctx.throw(1003, themeModuleName);
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

    // theme extend
    watcherThemes(site, themeModuleName) {
      this._watcherThemes(site, themeModuleName);
    }

    _watcherThemes(site, themeModuleName) {
      // module
      const module = this.app.meta.modules[themeModuleName];
      if (!module) this.ctx.throw(1003, themeModuleName);
      // extend
      const moduleExtend = module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.extend;
      if (moduleExtend) {
        this._watcherThemes(site, moduleExtend);
      }
      // current
      if (!module.info.public) {
        site._watchers.push(path.join(module.root, 'backend/cms'));
      // site._watchers.push(path.join(module.root, 'backend/src'));
      }
    }

    async _checkIfSiteBuilt({ site }) {
      // check if build site first
      const pathIntermediate = await this.getPathIntermediate(site.language.current);
      const fileName = path.join(pathIntermediate, 'main/article.ejs');
      return await fse.pathExists(fileName);
    }

    async getArticleUrl({ key }) {
      // article
      const article = await this.ctx.bean._getBean(`${moduleInfo.relativeName}.atom.article`)._getArticle({ key, inner: true });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // site
      const site = await this.getSite({ language: article.atomLanguage });
      // check if build site first
      const siteBuilt = await this._checkIfSiteBuilt({ site });
      if (!siteBuilt) this.ctx.throw(1006);
      // fileName
      const pathDist = await this.getPathDist(site, article.atomLanguage);
      const fileName = path.join(pathDist, article.url);
      const exists = await fse.pathExists(fileName);
      if (!exists) this.ctx.throw.module('a-base', 1002);
      // ok
      const url = this.getUrl(site, site.language.current, article.url);
      return {
        relativeUrl: article.url,
        url,
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
            if (module.main.meta.base.atoms[key].info.cms !== true) continue;
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
                site = await this.ctx.service.site.getSite({
                  atomClass,
                  language,
                  options: {
                    envs: false,
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

  return Build;
};



/***/ }),

/***/ 83:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const data = context.data;
      const queueAction = data.queueAction;
      return await this[queueAction](data);
    }

    async buildLanguage({ atomClass, language, progressId }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.buildLanguage({ language, progressId });
    }

    async buildLanguages({ atomClass, progressId }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.buildLanguages({ progressId });
    }

    async renderArticle({ atomClass, key, inner }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.renderArticle({ key, inner });
    }

    async deleteArticle({ atomClass, key, article, inner }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.deleteArticle({ key, article, inner });
    }

  }

  return Queue;
};


/***/ }),

/***/ 502:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Startup extends app.meta.BeanBase {

    async execute() {
      // only in development
      if (!app.meta.isLocal) return;
      // loop modules
      for (const module of app.meta.modulesArray) {
        // cms.site=true
        if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.site) {
          // loop atomClasses
          for (const key in module.main.meta.base.atoms) {
            if (module.main.meta.base.atoms[key].info.cms === false) continue;
            // atomClass
            const atomClass = {
              module: module.info.relativeName,
              atomClassName: key,
              atomClassIdParent: 0,
            };
            const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
            await build.registerWatchers();
          }
        }
      }
    }

  }

  return Startup;
};


/***/ }),

/***/ 899:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const uuid = require3('uuid');
const utils = __webpack_require__(294);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {

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

        // atomClass
        await this._update5AtomClassIds(options);

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

        // uuid
        await this._update6Uuids(options);

      }

      if (options.version === 7) {
        // update cms blocks
        await this.ctx.model.query(`
          update aCmsContent set content = replace (content,'cms-pluginblock:audio','cms-pluginblock:blockAudio') where content like '%cms-pluginblock:audio%'
        `);
        await this.ctx.model.query(`
          update aCmsContent set content = replace (content,'cms-pluginblock:iframe','cms-pluginblock:blockIFrame') where content like '%cms-pluginblock:iframe%'
        `);
        // migration: languange/category/tag
        await this._update7Migration(options);
      }

      if (options.version === 8) {
        // schemas
        await this._update7Migration_schemas(options);
      }

    }

    async init(options) {
      if (options.version === 1) {
        // create roles: cms-writer cms-publisher to template
        const roles = [ 'cms-writer', 'cms-publisher' ];
        const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
        const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
        for (const roleName of roles) {
          const roleId = await this.ctx.bean.role.add({
            roleName,
            roleIdParent: roleTemplate.id,
          });
          // role:superuser include cms-writer cms-publisher
          await this.ctx.bean.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
        }
        // build roles
        await this.ctx.bean.role.setDirty(true);

        // add role rights
        const roleRights = [
          { roleName: 'cms-writer', action: 'create' },
          { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'clone', scopeNames: 0 },
          { roleName: 'cms-writer', action: 'deleteBulk' },
          { roleName: 'cms-writer', action: 'exportBulk' },
          { roleName: 'cms-publisher', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'cms-publisher', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'root', action: 'read', scopeNames: 0 },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });

      }

    }

    async test() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'article',
      };
      const categories = [
        { categoryName: 'test1', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2', language: 'en-us', categoryIdParent: 0 },
        { categoryName: 'test2-1', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test2-2', language: 'en-us', categoryIdParent: 'test2' },
        { categoryName: 'test3', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
        { categoryName: 'testHidden', language: 'en-us', categoryIdParent: 0, categoryHidden: 1 },
        { categoryName: 'testFlag', language: 'en-us', categoryIdParent: 0, categoryFlag: 'Flag' },
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

    async _update5AtomClassIds(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update5AtomClassIdsInstance',
        });
      }
    }

    async _update5AtomClassIdsInstance() {
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

    async _update6Uuids(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update6UuidsInstance',
        });
      }
    }

    async _update6UuidsInstance() {
      const articles = await this.ctx.model.article.select();
      for (const article of articles) {
        const uuid = this._parseUuid(article);
        await this.ctx.model.article.update({
          id: article.id,
          uuid,
        });
      }
    }

    async _update7Migration(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update7MigrationInstance',
        });
      }
    }

    async _update7MigrationInstance() {
      // cagetories
      const mapCagetoryIds = await this._update7Migration_cagetories();
      // tags
      const mapTagIds = await this._update7Migration_tags();
      // articles/post
      await this._update7Migration_articles({ mapCagetoryIds, mapTagIds });
    }

    async _update7Migration_schemas() {
      let sql;
      // aCmsArticle
      sql = `
        ALTER TABLE aCmsArticle
          DROP COLUMN categoryId,
          DROP COLUMN language
        `;
      await this.ctx.model.query(sql);
      // aCmsArticleTag
      sql = 'DROP TABLE aCmsArticleTag';
      await this.ctx.model.query(sql);
      // aCmsArticleTagRef
      sql = 'DROP TABLE aCmsArticleTagRef';
      await this.ctx.model.query(sql);
      // aCmsCategory
      sql = 'DROP TABLE aCmsCategory';
      await this.ctx.model.query(sql);
      // aCmsTag
      sql = 'DROP TABLE aCmsTag';
      await this.ctx.model.query(sql);
      // aCmsArticleView
      sql = 'DROP VIEW aCmsArticleView';
      await this.ctx.model.query(sql);
      // aCmsArticleViewFull
      await this.ctx.model.query('drop view aCmsArticleViewFull');
      sql = `
          CREATE VIEW aCmsArticleViewFull as
            select a.*,b.content,b.html from aCmsArticle a
              left join aCmsContent b on a.id=b.itemId
        `;
      await this.ctx.model.query(sql);
      // aCmsArticleViewSearch
      await this.ctx.model.query('drop view aCmsArticleViewSearch');
      sql = `
          CREATE VIEW aCmsArticleViewSearch as
            select a.*,b.content,b.html,concat(c.atomName,',',b.content) contentSearch from aCmsArticle a
              left join aCmsContent b on a.id=b.itemId
              left join aAtom c on a.atomId=c.id
        `;
      await this.ctx.model.query(sql);
      // aCmsArticleViewTag
      await this.ctx.model.query('drop view aCmsArticleViewTag');
    }

    async _update7Migration_articles({ mapCagetoryIds, mapTagIds }) {
      // articles
      const articles = await this.ctx.model.query(`
        select a.*,b.userIdCreated,c.tags
           from aCmsArticle a
           left join aAtom b on b.id=a.atomId
           left join aCmsArticleTag c on c.atomId=a.atomId
            where a.iid=? and a.deleted=0 and b.atomStage=1
        `, [ this.ctx.instance.id ]);
      // loop
      for (const article of articles) {
        await this._update7Migration_article({ mapCagetoryIds, mapTagIds, article });
      }
    }

    async _update7Migration_article({ mapCagetoryIds, mapTagIds, article }) {
      // user
      const user = { id: article.userIdCreated };
      // open
      const res = await this.ctx.bean.atom.openDraft({ key: { atomId: article.atomId }, user });
      const draftKey = res.draft.key;
      // atomCategoryId
      const atomCategoryId = article.categoryId === 0 ? 0 : mapCagetoryIds[article.categoryId];
      // atomTags
      let atomTags = article.tags;
      if (article.tags) {
        const _tags = JSON.parse(article.tags);
        atomTags = _tags.map(item => {
          return mapTagIds[item.id];
        });
        atomTags = JSON.stringify(atomTags);
      }
      // write
      await this.ctx.bean.atom.write({
        key: draftKey,
        target: null,
        item: {
          atomLanguage: article.language,
          atomCategoryId,
          atomTags,
        },
        options: {
          ignoreRender: true,
        },
        user,
      });
      // submit
      await this.ctx.bean.atom.submit({
        key: draftKey,
        options: {
          ignoreRender: true,
          ignoreFlow: true,
        },
        user,
      });
    }

    async _update7Migration_tags() {
      const mapTagIds = {};
      const tags = await this.ctx.model.select('aCmsTag', {
        where: {
          iid: this.ctx.instance.id,
          deleted: 0,
        },
      });
      for (const tag of tags) {
        await this._update7Migration_tag({ mapTagIds, tags, tag });
      }
      return mapTagIds;
    }

    async _update7Migration_tag({ mapTagIds, tag }) {
      const tagIdNew = await this.ctx.bean.tag.add({
        atomClass: { id: tag.atomClassId },
        data: {
          language: tag.language,
          tagName: tag.tagName,
          tagAtomCount: tag.articleCount,
        },
      });
      mapTagIds[tag.id] = tagIdNew;
      return tagIdNew;
    }

    async _update7Migration_cagetories() {
      const mapCagetoryIds = {};
      const categories = await this.ctx.model.select('aCmsCategory', {
        where: {
          iid: this.ctx.instance.id,
          deleted: 0,
        },
      });
      for (const category of categories) {
        await this._update7Migration_cagetory({ mapCagetoryIds, categories, category });
      }
      return mapCagetoryIds;
    }
    async _update7Migration_cagetory({ mapCagetoryIds, categories, category }) {
      if (category.__parsed) return mapCagetoryIds[category.id];
      let categoryIdParent = 0;
      if (category.categoryIdParent > 0) {
        const categoryParent = categories.find(item => item.id === category.categoryIdParent);
        categoryIdParent = await this._update7Migration_cagetory({ mapCagetoryIds, categories, category: categoryParent });
      }
      const categoryIdNew = await this.ctx.bean.category.add({
        atomClass: { id: category.atomClassId },
        data: {
          language: category.language,
          categoryName: category.categoryName,
          categoryHidden: category.hidden,
          categorySorting: category.sorting,
          categoryFlag: category.flag,
          categoryUrl: category.url,
          categoryIdParent,
        },
      });
      category.__parsed = true;
      mapCagetoryIds[category.id] = categoryIdNew;
      return categoryIdNew;
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

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const localBuild = __webpack_require__(375);
const queueRender = __webpack_require__(83);
const startupRegisterAllWatchers = __webpack_require__(502);
const atomArticle = __webpack_require__(43);
const ioMessageHotloadFile = __webpack_require__(762);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.build': {
      mode: 'app',
      bean: localBuild,
    },
    // queue
    'queue.render': {
      mode: 'app',
      bean: queueRender,
    },
    // startup
    'startup.registerAllWatchers': {
      mode: 'app',
      bean: startupRegisterAllWatchers,
    },
    // atom
    'atom.article': {
      mode: 'app',
      bean: atomArticle,
    },
    // io
    'io.message.hotloadFile': {
      mode: 'ctx',
      bean: ioMessageHotloadFile,
    },
  };
  return beans;
};


/***/ }),

/***/ 798:
/***/ ((module) => {

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

/***/ 294:
/***/ ((module) => {


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
      const res = await ctx.bean.atomClass.get(_atomClass);
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

/***/ 985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const chokidar = require3('chokidar');
const debounce = require3('debounce');

module.exports = function(app) {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Watcher {

    constructor() {
      this._watchers = {};
      this._init();
    }

    _init() {
      if (app.meta.inApp) {
        // app
        app.meta.messenger.addProvider({
          name: 'a-cms:watcherChange',
          handler: async info => {
            await this._change(info);
          },
        });
      } else {
        // agent
        app.meta.messenger.addProvider({
          name: 'a-cms:watcherRegister',
          handler: info => {
            this._register(info);
          },
        });
        app.meta.messenger.addProvider({
          name: 'a-cms:watcherRegisterLanguages',
          handler: info => {
            this._registerLanguages(info);
          },
        });
      }
    }

    // called by app
    register(info) {
      app.meta.messenger.callAgent({ name: 'a-cms:watcherRegister', data: info });
    }

    // called by app
    registerLanguages(info) {
      app.meta.messenger.callAgent({ name: 'a-cms:watcherRegisterLanguages', data: info });
    }

    // invoked in agent
    _registerLanguages({ info, watcherInfos }) {
      // key
      const atomClasskey = JSON.stringify(info.atomClass);
      // clear
      const _arr = this._watchers.geto(info.subdomain).geto(info.atomClass.module).geto(atomClasskey);
      for (const language in _arr) {
        const watcherEntry = _arr[language];
        if (watcherEntry.watcher) {
          watcherEntry.watcher.close();
          watcherEntry.watcher = null;
        }
      }
      // register
      for (const watcherInfo of watcherInfos) {
        this._register(watcherInfo);
      }
    }

    // invoked in agent
    _register({ subdomain, atomClass, language, watchers }) {
      // key
      const atomClasskey = JSON.stringify(atomClass);
      // watcherEntry
      const watcherEntry = this._watchers
        .geto(subdomain).geto(atomClass.module).geto(atomClasskey)
        .geto(language);
      if (watcherEntry.watcher) {
        watcherEntry.watcher.close();
        watcherEntry.watcher = null;
      } else {
        watcherEntry.info = { subdomain, atomClass, language, watchers };
      }
      // watcher
      watcherEntry.watcher = chokidar.watch(watchers)
        .on('change', debounce(function() {
          app.meta.messenger.callRandom({
            name: 'a-cms:watcherChange',
            data: { subdomain, atomClass, language },
          });
        }, 300));
    }

    // invoked in app
    async _change({ subdomain, atomClass, language }) {
      app.meta.queue.push({
        subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguage',
          atomClass,
          language,
        },
      });
    }

  }

  return Watcher;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    render: {
      bean: 'render',
      concurrency: true,
    },
  };

  // startups
  config.startups = {
    registerAllWatchers: {
      bean: 'registerAllWatchers',
      instance: true,
      debounce: true,
    },
  };

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
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
    beian: {
      icp: '',
    },
  };

  //
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Language must not be Empty',
  1002: 'Theme %s:%s:%s not Set',
  1003: 'Theme %s not Found',
  1004: 'Cannot delete if has children',
  1005: 'Cannot delete if has articles',
  1006: 'Build Site First',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  'en-us': 'English',
  'zh-cn': 'Chinese',
  PersonalProfile: 'Profile',
  AuthorProfile: 'Author Profile',
  ArticlePrevious: 'Previous',
  ArticleNext: 'Next',
  second2: 's',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

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
  'Are You Sure?': '您确认吗？',
  'Article List': '文章清单',
  'Article List(by Category)': '文章清单(按目录)',
  'Category Name': '目录名称',
  'Comment Disabled': '禁止评论',
  'Create Article': '新建文章',
  'Language must not be Empty': '语言不允许为空',
  'Load More': '加载更多',
  'Post Comment': '发表评论',
  'Recent Comments': '最近评论',
  'Theme %s:%s:%s not Set': '没有设置主题%s:%s:%s',
  'Theme %s not Found': '没有找到主题%s',
  'en-us': '英语',
  'zh-cn': '简体中文',
  'CMS Block': 'CMS区块',
  PersonalProfile: '个人信息',
  AuthorProfile: '作者信息',
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
  'Cannot delete if has children': '有子元素时不允许删除',
  'Cannot delete if has articles': '有文章时不允许删除',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 685:
/***/ ((module) => {

module.exports = app => {
  const hotloadFile = {
    info: {
      bean: 'hotloadFile',
      title: 'Hotload File',
      persistence: false,
    },
  };
  return hotloadFile;
};


/***/ }),

/***/ 397:
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
              atomClassName: 'article',
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
              write: true,
            },
          },
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
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
    atomName: 'CMS Article Publish',
    atomStaticKey: 'flowArticlePublish',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const articlePublish = __webpack_require__(397);

module.exports = app => {
  const flowDefs = [
    articlePublish(app),
  ];
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
      atomName: 'Create Article',
      atomStaticKey: 'createArticle',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'create',
      }),
      resourceRoles: 'template.cms-writer',
    },
    {
      atomName: 'Article List',
      atomStaticKey: 'listArticle',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'read',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};


/***/ }),

/***/ 415:
/***/ ((module) => {

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
        // unique slug for atomLanguage and atomClass
        const ctx = this;
        //   atomClass from atomId
        const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: rootData.atomId });
        //   read by atomClass, atomLanguage, slug
        const items = await ctx.model.query(`
          select a.id from aAtom a
            left join aCmsArticle b on a.id=b.atomId
              where a.atomStage=0 and a.iid=? and a.deleted=0 and a.atomClassId=? and a.atomLanguage=? and b.slug=?
          `, [ ctx.instance.id, atomClass.id, rootData.atomLanguage, data ]);
        if (items[0] && items[0].id !== rootData.atomId) {
          const errors = [{ keyword: 'x-slug', params: [], message: ctx.text('Slug Exists') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    properties: {
      atomId: {
        type: 'number',
      },
      // title
      groupTitle: {
        type: 'null',
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
      groupContent: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Content',
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleContent',
        },
      },
      // Basic Info
      groupBasicInfo: {
        type: 'null',
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
        type: [ 'string', 'null' ],
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
        ebTextarea: true,
        ebTitle: 'Description',
      },
      slug: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Slug',
        'x-slug': true,
      },
      allowComment: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Comment',
        default: true,
      },
      // Extra
      groupExtra: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Extra',
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
      editMode: {
        type: 'number',
        // ebType: 'text',
        ebTitle: 'Edit Mode',
        notEmpty: true,
      },
    },
  };

  // article search
  schemas.articleSearch = {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };

  return schemas;
};


/***/ }),

/***/ 885:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const extend = require3('extend2');
const utils = __webpack_require__(294);

module.exports = app => {

  class ArticleController extends app.Controller {

    // list
    async list() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // stage
      options.stage = 'formal';
      // user
      const user = this.ctx.state.user.op;
      // select
      options.page = this.ctx.bean.util.page(options.page, false);
      const items = await this.ctx.bean.atom.select({ atomClass, options, user, pageForce: false });
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

/***/ 261:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(294);

module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // stage
      options.stage = 'formal';
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

/***/ 330:
/***/ ((module) => {

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

/***/ 262:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
        language,
        orders: [
          [ 'a.updatedAt', 'desc' ],
        ],
        page: { index: 0 },
        mode: 'default',
      };
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/cms/article/list',
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
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
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
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
      const article = await this.ctx.bean._getBean(`${moduleInfo.relativeName}.atom.article`)._getArticle({ key: { atomId }, inner: false });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // language
      const language = article.atomLanguage;
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
      const atomClass = await this.ctx.bean.atomClass.get({ id: article.atomClassId });
      // build
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
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

/***/ 683:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(294);

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SiteController extends app.Controller {

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
      const progressId = await this.ctx.bean.progress.create();
      // build
      this.ctx.service.site.buildLanguageQueue({ atomClass, language, progressId });
      this.ctx.success({ progressId });
    }

    async buildLanguages() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // progress
      const progressId = await this.ctx.bean.progress.create();
      // build
      this.ctx.service.site.buildLanguagesQueue({ atomClass, progressId });
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

    async blockSave() {
      const res = await this.ctx.service.site.blockSave({
        blockName: this.ctx.request.body.blockName,
        item: this.ctx.request.body.item,
      });
      this.ctx.success(res);
    }

    async getStats() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getStats({
        atomClass,
        languages: this.ctx.request.body.languages,
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

  }
  return SiteController;
};



/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const article = __webpack_require__(885);
const render = __webpack_require__(330);
const site = __webpack_require__(683);
const comment = __webpack_require__(261);
const rss = __webpack_require__(262);

module.exports = app => {
  const controllers = {
    article,
    render,
    site,
    comment,
    rss,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const WatcherFn = __webpack_require__(985);

module.exports = app => {

  // watcher: only in development
  if (app.meta.isLocal) {
    app.meta['a-cms:watcher'] = new (WatcherFn(app))();
  }

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
  const keywords = __webpack_require__(415)(app);
  const schemas = __webpack_require__(232)(app);
  const socketioHotloadFile = __webpack_require__(685)(app);
  const staticFlowDefs = __webpack_require__(772)(app);
  const staticResources = __webpack_require__(429)(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            bean: 'article',
            title: 'Article',
            tableName: 'aCmsArticle',
            tableNameModes: {
              default: 'aCmsArticle',
              full: 'aCmsArticleViewFull',
              search: 'aCmsArticleViewSearch',
            },
            language: true,
            category: true,
            tag: true,
            cms: true,
          },
          actions: {
          },
          validator: 'article',
          search: {
            validator: 'articleSearch',
          },
        },
      },
      resources: {
        block: {
          title: 'CMS Block',
        },
      },
      statics: {
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
        article: {
          schemas: 'article',
        },
        articleSearch: {
          schemas: 'articleSearch',
        },
      },
      keywords: {
        'x-slug': keywords.slug,
      },
      schemas: {
        article: schemas.article,
        articleSearch: schemas.articleSearch,
      },
    },
    settings: {
      instance: {
        actionPath: 'config/list',
      },
    },
    event: {
      implementations: {
      },
    },
    socketio: {
      messages: {
        hotloadFile: socketioHotloadFile,
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 645:
/***/ ((module) => {

module.exports = app => {
  class Article extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticle', options: { disableDeleted: false } });
    }
  }
  return Article;
};


/***/ }),

/***/ 504:
/***/ ((module) => {

module.exports = app => {
  class Content extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsContent', options: { disableDeleted: false } });
    }
  }
  return Content;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const article = __webpack_require__(645);
const content = __webpack_require__(504);

module.exports = app => {
  const models = {
    article,
    content,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  let routes = [
    // article
    { method: 'post', path: 'article/list', controller: 'article' },
    { method: 'post', path: 'article/attachments', controller: 'article' },
    // comment
    { method: 'post', path: 'comment/all', controller: 'comment' },
    // render
    { method: 'post', path: 'render/getArticleUrl', controller: 'render',
      meta: { right: { type: 'atom', action: 2, checkFlow: true } },
    },
    // site
    { method: 'post', path: 'site/getConfigSiteBase', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigSite', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigSite', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguagePreview', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguage', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigLanguage', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguage', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguages', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getLanguages', controller: 'site' },
    { method: 'post', path: 'site/getUrl', controller: 'site' },
    { method: 'post', path: 'site/blockSave', controller: 'site' },
    { method: 'post', path: 'site/getStats', controller: 'site', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
    // rss
    { method: 'get', path: 'rss/feed/article/comments/:atomId', controller: 'rss', action: 'articleComments' },
    { method: 'get', path: 'rss/feed/comments/:module/:atomClassName/:language', controller: 'rss', action: 'feedComments' },
    { method: 'get', path: 'rss/feed/:module/:atomClassName/:language', controller: 'rss', action: 'feed' },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      // site
      { method: 'post', path: 'site/checkFile', controller: 'site' },
    ]);
  }
  return routes;
};


/***/ }),

/***/ 20:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Render extends app.Service {

    async getArticleUrl({ atomClass, key }) {
      if (!atomClass) {
        atomClass = await this.ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getArticleUrl({ key });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.combineSiteBase({ mergeConfigSite });
    }

  }

  return Render;
};


/***/ }),

/***/ 724:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const fse = require3('fs-extra');

let __blocks = null;

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Site extends app.Service {

    async getSite({ atomClass, language, options }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getSite({ language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigSite();
    }

    // save site config
    async setConfigSite({ atomClass, data }) {
      // build
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      // save
      await build.setConfigSite({ data });
      // only in development
      if (this.ctx.app.meta.isLocal) {
        // build site
        this.buildLanguagesQueue({ atomClass });
        // register watchers
        await build.registerWatchers();
      }
    }

    async getConfigLanguagePreview({ atomClass, language }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigLanguagePreview({ language });
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigLanguage({ language });
    }

    // save language config
    async setConfigLanguage({ atomClass, language, data }) {
      // build
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      // save
      await build.setConfigLanguage({ language, data });
      // only in development
      if (this.ctx.app.meta.isLocal) {
        // build site
        this.buildLanguageQueue({ atomClass, language });
        // register watcher
        await build.registerWatcher({ language });
      }
    }

    async getLanguages({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getLanguages();
    }

    async getUrl({ atomClass, language, path }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      const site = await build.getSite({ language });
      return build.getUrl(site, language, path);
    }

    buildLanguagesQueue({ atomClass, progressId }) {
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
    }

    buildLanguageQueue({ atomClass, language, progressId }) {
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
    }

    async getStats({ atomClass, languages }) {
      const res = {};
      for (const language of languages) {
        res[language] = await this._getStatsLanguange({ atomClass, language });
      }
      return res;
    }

    async _getStatsLanguange({ atomClass, language }) {
      const stats = {};

      // articles
      stats.articles = await this.ctx.bean.atom.count({
        atomClass,
        options: {
          language,
          mode: 'default',
        },
      });

      // comments
      stats.comments = await this.ctx.bean.atom.count({
        atomClass,
        options: {
          language,
          mode: 'default',
          comment: 1,
        },
      });

      // categories
      stats.categories = await this.ctx.bean.category.count({
        atomClass, language,
      });

      // tags
      stats.tags = await this.ctx.bean.tag.count({
        atomClass, language,
      });

      // ok
      return stats;
    }

    async blockSave({ blockName, item }) {
      // block
      const blocks = this.getBlocks();
      const block = blocks[blockName];
      // validate
      await this.ctx.bean.validation.validate({
        module: block.validator.module,
        validator: block.validator.validator,
        schema: null,
        data: item,
      });
      // output
      if (!block.output) return item;
      return await block.output({ ctx: this.ctx, block, data: item });
    }

    getBlocks() {
      if (!__blocks) {
        __blocks = this._prepareBlocks();
      }
      return __blocks;
    }

    _prepareBlocks() {
      const blocks = {};
      // (X) modulesArray for block override
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.cms &&
          module.main.meta.cms.plugin && module.main.meta.cms.plugin.blocks) {
          const blocksModule = this._prepareBlocksModule({ module, blocks: module.main.meta.cms.plugin.blocks });
          Object.assign(blocks, blocksModule);
        }
      }
      return blocks;
    }

    _prepareBlocksModule({ module, blocks }) {
      const blocksModule = {};
      const moduleName = module.info.relativeName;
      for (const key in blocks) {
        const fullName = `${moduleName}:${key}`;
        blocksModule[fullName] = blocks[key];
      }
      return blocksModule;
    }

    async checkFile({ file, mtime }) {
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
      // default
      return null;
    }

  }

  return Site;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const render = __webpack_require__(20);
const site = __webpack_require__(724);

module.exports = app => {
  const services = {
    render,
    site,
  };
  return services;
};


/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map