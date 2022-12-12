/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4043:
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

/***/ 618:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cms {
    get render() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.render');
    }

    get site() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.site');
    }

    build({ atomClass }) {
      return ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
    }
  }

  return Cms;
};


/***/ }),

/***/ 8762:
/***/ ((module) => {

module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {}
  return IOMessage;
};


/***/ }),

/***/ 9375:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(1017);
const require3 = __webpack_require__(5638);
const ejs = require3('@zhennann/ejs');
const pMap = require3('p-map');
const extend = require3('@zhennann/extend');
const fse = require3('fs-extra');
const moment = require3('moment');
const eggBornUtils = require3('egg-born-utils');
const CleanCSS = require3('clean-css');
const shajs = require3('sha.js');
const babel = require3('@babel/core');
const UglifyJS = require3('uglify-js');
const less = require3('less');
const utils = __webpack_require__(9294);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Build extends app.meta.BeanBase {
    constructor(ctx, atomClass) {
      super(ctx);
      this.atomClass = utils.atomClass(atomClass);
      this.default = this.atomClass.module === 'a-cms';
    }

    get moduleConfig() {
      return this.ctx.config.module(moduleInfo.relativeName);
    }

    get beanStatus() {
      return this.ctx.bean.status.module(moduleInfo.relativeName);
    }

    async getConfigSiteBase() {
      // config
      //    try other then default
      const configModule = this.ctx.config.module(this.atomClass.module);
      let configSite = this.ctx.bean.util.getProperty(configModule, `cms.sites.${this.atomClass.atomClassName}`);
      if (!configSite) {
        configSite = this.ctx.bean.util.getProperty(configModule, 'cms.site');
      }
      if (!configSite) {
        configSite = this.moduleConfig.cms.site;
      }

      // site
      const site = extend(true, {}, configSite);

      // plugins
      site.plugins = {};
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        const plugin = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.plugin');
        if (plugin) {
          site.plugins[relativeName] = this.ctx.config.module(relativeName).plugin;
        }
      }
      return site;
    }

    async getConfigSite() {
      const name = `config-site:${this.atomClass.module}:${this.atomClass.atomClassName}`;
      return await this.beanStatus.get(name);
    }

    async setConfigSite({ data }) {
      const name = `config-site:${this.atomClass.module}:${this.atomClass.atomClassName}`;
      await this.beanStatus.set(name, data);
    }

    async getConfigLanguage({ language }) {
      language = language || 'default';
      const name = `config-${language}:${this.atomClass.module}:${this.atomClass.atomClassName}`;
      return await this.beanStatus.get(name);
    }

    async setConfigLanguage({ language, data }) {
      language = language || 'default';
      const name = `config-${language}:${this.atomClass.module}:${this.atomClass.atomClassName}`;
      this._adjustConfigLanguange(data);
      await this.beanStatus.set(name, data);
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

    _getThemeName({ site, language }) {
      const atomClass = site.atomClass || this.atomClass;
      let themeName = site.themes[language || 'default'];
      if (!themeName) {
        // // log info
        // const error = this.ctx.parseFail.module(moduleInfo.relativeName, 1002, atomClass.module, atomClass.atomClassName, language);
        // this.ctx.logger.info(error.message);
        // use default
        if (site.language) {
          language = site.language.default;
          themeName = site.themes[language];
        } else {
          themeName = site.themes.default;
        }
      }
      // throw error if empty either
      if (!themeName) {
        this.ctx.throw.module(moduleInfo.relativeName, 1002, atomClass.module, atomClass.atomClassName, language);
      }
      // ok
      return { themeName, language };
    }

    async getLanguages() {
      const siteBase = await this.combineSiteBase();
      if (!siteBase.language) return [];
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
      // themeName
      const __themeName = this._getThemeName({ site: siteBase, language });
      const themeName = __themeName.themeName;
      language = __themeName.language;
      // theme
      const theme = this.combineThemes(themeName);
      // site(db)
      const configSite = await this.getConfigSite();
      // language(db)
      const configLanguage = await this.getConfigLanguage({ language });
      // combine
      return extend(true, {}, siteBase, theme, configSite, configLanguage, {
        language: language ? { current: language } : false,
      });
    }

    // theme extend
    combineThemes(themeModuleName) {
      return this._combineThemes(themeModuleName);
    }

    _combineThemes(themeModuleName) {
      // module
      const module = this.app.meta.modules[themeModuleName];
      if (!module) this.ctx.throw.module(moduleInfo.relativeName, 1003, themeModuleName);
      const moduleExtend = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.extend');
      if (!moduleExtend) return this.ctx.config.module(themeModuleName).theme;
      return extend(true, {}, this._combineThemes(moduleExtend), this.ctx.config.module(themeModuleName).theme);
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
      if (site.language) {
        for (const item of site.language.items.split(',')) {
          site.languages.push({
            name: item,
            title: this.ctx.text.locale(item, item),
            url: this.getUrl(site, item, 'index.html'),
          });
        }
      }
      // front
      site.front = {};
      // front.env
      site.front.env = extend(
        true,
        {
          base: site.base,
          language: site.language,
        },
        site.env,
        {
          site: {
            serverUrl: site.serverUrl,
            rawRootUrl: this.getUrlRawRoot(site),
            atomClass: this.atomClass,
          },
        }
      );
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
      return this.default ? 'cms' : `cms.${this.atomClass.module}.${this.atomClass.atomClassName}`;
    }

    getUrlRawRoot(site) {
      if (this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal) {
        // cms or cms.moduleName
        const cmsPathName = this.getCMSPathName();
        const forwardUrl = this.ctx.bean.base.getForwardUrl(`${cmsPathName}/dist`);
        const absoluteUrl = this.ctx.bean.base.getAbsoluteUrl(forwardUrl);
        return absoluteUrl;
      }
      return `${site.host.url}${site.host.rootPath ? '/' + site.host.rootPath : ''}`;
    }
    getUrlRoot(site, language) {
      const rawRoot = this.getUrlRawRoot(site);
      return `${rawRoot}${!site.language || language === site.language.default ? '' : '/' + language}`;
    }
    getUrl(site, language, path) {
      const urlRoot = this.getUrlRoot(site, language);
      return path ? `${urlRoot}/${path}` : urlRoot;
    }
    getServerUrl(path) {
      return this.ctx.bean.base.getAbsoluteUrl(path);
    }

    async getPathCustom(language) {
      language = language || 'default';
      const cms = await this.getPathCms();
      return path.join(cms, language, 'custom');
    }
    async getPathIntermediate(language) {
      language = language || 'default';
      const cms = await this.getPathCms();
      return path.join(cms, language, 'intermediate');
    }
    async getPathDist(site, language) {
      const rawDist = await this.getPathRawDist();
      return path.join(rawDist, !site.language || language === site.language.default ? '' : '/' + language);
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
      let article = await this.ctx.bean.cms.render.getArticle({ key, inner });
      if (!article) {
        if (inner) return;
        // check for inner
        article = await this.ctx.bean.cms.render.getArticle({ key, inner: true });
        if (!article) return;
        inner = true;
      }
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language: article.atomLanguage });
      // check if build site first
      const siteBuilt = await this._checkIfSiteBuilt({ site, force: true });
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

    async deleteArticle({ /* key,*/ article, inner }) {
      // maybe not rendered
      if (!article.url) return;
      // maybe site.language is false
      // // same logic with renderArticle
      // if (!article.atomLanguage) {
      //   article.atomLanguage = this.ctx.locale;
      // }
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language: article.atomLanguage });
      // check if build site first
      const siteBuilt = await this._checkIfSiteBuilt({ site, force: false });
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
          language: site.language ? site.language.current : null,
          orders: [['a.updatedAt', 'desc']],
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
      const pathIntermediate = await this.getPathIntermediate(site.language && site.language.current);
      const indexFiles = await eggBornUtils.tools.globbyAsync(`${pathIntermediate}/main/index/**/*.ejs`);
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
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      for (const article of articles) {
        const loc = this.getUrl(site, site.language && site.language.current, article.url);
        const lastmod = moment(article.updatedAt).format();
        xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
`;
      }
      xml += '</urlset>';
      // save
      const pathDist = await this.getPathDist(site, site.language && site.language.current);
      const fileName = path.join(pathDist, 'sitemap.xml');
      await fse.writeFile(fileName, xml);
    }

    async _writeSitemap({ site, article }) {
      const loc = this.getUrl(site, site.language && site.language.current, article.url);
      const lastmod = moment(article.updatedAt).format();
      // load
      const pathDist = await this.getPathDist(site, site.language && site.language.current);
      const fileName = path.join(pathDist, 'sitemap.xml');
      let xml;
      const exists = await fse.pathExists(fileName);
      if (!exists) {
        xml = `<?xml version="1.0" encoding="UTF-8"?>
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
        xml = xml.replace(
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
        );
      }
      // save
      await fse.writeFile(fileName, xml);
    }

    async _renderStatic({ site }) {
      // static
      const pathIntermediate = await this.getPathIntermediate(site.language && site.language.current);
      const staticFiles = await eggBornUtils.tools.globbyAsync(`${pathIntermediate}/static/**/*.ejs`);
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
      const language = site.language && site.language.current;
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
      if (data.article) {
        hotloadFile = `atom/${data.article.atomId}`;
        // update renderAt
        data.article.renderAt = new Date(this.ctx.bean.util.moment().unix() * 1000);
      } else {
        if ((this.app.meta.isTest || this.app.meta.isLocal) && fileDest.indexOf('.html') > -1) {
          hotloadFile = fileWrite;
          data.env('site.hotloadFile', hotloadFile);
        }
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
      // renderAt must be updated after file rendered
      if (data.article) {
        // update renderAt
        await this.ctx.model.query(
          `
          update aCmsArticle set renderAt=?
            where iid=? and atomId=?
          `,
          [data.article.renderAt, this.ctx.instance.id, data.article.atomId]
        );
      }
      // socketio publish
      if (hotloadFile) {
        await this._socketioPublish({ hotloadFile, article: data.article });
      }
    }

    async _socketioPublish({ hotloadFile, article }) {
      const message = {
        userIdTo: -1,
        content: {
          mtime: new Date(),
          article,
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
      return !config || !config.disabled;
    }

    async _loadPluginIncludes({ site, language }) {
      // if exists
      if (site._pluginIncludes) return site._pluginIncludes;
      // modulesArray
      let pluginIncludes = '';
      for (const module of this.app.meta.modulesArray) {
        const plugin = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.plugin');
        if (plugin && this._checkIfPluginEnable({ site, moduleName: module.info.relativeName })) {
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
      data.js('plugins/cms-pluginbase/assets/js/lib/require.min.js');
      data.js('plugins/cms-pluginbase/assets/js/lib/regenerator-runtime/runtime.js');
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
      if (!site._cache[type]) site._cache[type] = {};
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
              _content = babel.transform(_content, {
                ast: false,
                babelrc: false,
                presets: ['@babel/preset-env'],
                plugins: [],
              }).code;
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
        const pathDist = await this.getPathDist(site, site.language && site.language.current);
        const fileWrite = path.join(pathDist, fileDest);
        // write
        await fse.outputFile(fileWrite, result);
        // url
        urlDest = this.getUrl(site, site.language && site.language.current, fileDest);
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

    getCurrentLocale({ site }) {
      return site.language ? site.language.current : this.ctx.app.config.i18n.defaultLocale;
    }

    createUtilTime({ site }) {
      const self = this;
      const _textLocale = this.getCurrentLocale({ site });
      return {
        now(fmt, locale) {
          return self.ctx.bean.util.now(fmt, locale || _textLocale);
        },
        today(fmt, locale) {
          return self.ctx.bean.util.today(fmt, locale || _textLocale);
        },
        formatDateTime(date, fmt, locale) {
          return self.ctx.bean.util.formatDateTime(date, fmt, locale || _textLocale);
        },
        formatDate(date, sep, locale) {
          return self.ctx.bean.util.formatDate(date, sep, locale || _textLocale);
        },
        formatTime(date, sep, locale) {
          return self.ctx.bean.util.formatTime(date, sep, locale || _textLocale);
        },
      };
    }

    async getData({ site }) {
      // data
      const self = this;
      const _csses = [];
      const _jses = [];
      const _envs = {};
      let _pathIntermediate = await this.getPathIntermediate(site.language && site.language.current);
      _pathIntermediate = path.join(_pathIntermediate, '/');
      const _textLocale = this.getCurrentLocale({ site });
      const time = this.createUtilTime({ site });
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
          if (fileName && (fileName.indexOf('http://') === 0 || fileName.indexOf('https://') === 0)) {
            return self.ctx.bean.util.escapeURL(fileName);
          }
          let _path = self.resolvePath('', path.relative(_pathIntermediate, this._filename), fileName);
          _path = _path.replace(/\\/gi, '/');
          const _url = self.getUrl(site, language || (site.language && site.language.current), _path);
          return self.ctx.bean.util.escapeURL(_url);
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
          return self.ctx.text.locale(_textLocale, ...args);
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
            return self.ctx.bean.util.escapeHtml(str);
          },
          escapeURL(str) {
            return self.ctx.bean.util.escapeURL(str);
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
        const languages = site.language ? site.language.items.split(',') : [null];

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
              text: site.language ? `${this.ctx.text('Build')} ${this.ctx.text(language)}` : this.ctx.text('Build'),
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
        const distFiles = await eggBornUtils.tools.globbyAsync(`${pathDist}/*`, { onlyFiles: false });
        const languages = site.language ? site.language.items.split(',') : null;
        for (const item of distFiles) {
          if (!site.language || languages.indexOf(path.basename(item)) === -1) {
            await fse.remove(item);
          }
        }

        // / copy files to intermediate
        // /  plugins<theme<custom

        // plugins
        for (const relativeName in this.app.meta.modules) {
          const module = this.app.meta.modules[relativeName];
          const plugin = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.plugin');
          if (plugin) {
            const pluginPath = path.join(module.root, 'backend/cms/plugin');
            const pluginFiles = await eggBornUtils.tools.globbyAsync(`${pluginPath}/*`, { onlyFiles: false });
            for (const item of pluginFiles) {
              await fse.copy(item, path.join(pathIntermediate, 'plugins', relativeName, path.basename(item)));
            }
          }
        }

        // theme
        const __themeName = this._getThemeName({ site, language });
        const themeName = __themeName.themeName;
        language = __themeName.language;
        await this.copyThemes(pathIntermediate, themeName);

        // custom
        const customPath = await this.getPathCustom(language);
        const customFiles = await eggBornUtils.tools.globbyAsync(`${customPath}/*`, { onlyFiles: false });
        for (const item of customFiles) {
          await fse.copy(item, path.join(pathIntermediate, path.basename(item)));
        }

        // intermediate dist
        const intermediateDistFiles = await eggBornUtils.tools.globbyAsync(`${pathIntermediate}/dist/*`, {
          onlyFiles: false,
        });
        for (const item of intermediateDistFiles) {
          await fse.copy(item, path.join(pathDist, path.basename(item)));
        }

        // / copy files to dist (ignore .ejs)
        // /  assets plugins/[plugin]/assets
        for (const dir of ['assets', 'plugins']) {
          if (dir === 'assets') {
            // assets
            const _filename = path.join(pathIntermediate, 'assets');
            const exists = await fse.pathExists(_filename);
            if (exists) {
              await fse.copy(_filename, path.join(pathDist, 'assets'));
            }
          } else {
            // plugins
            const pluginsFiles = await eggBornUtils.tools.globbyAsync(`${pathIntermediate}/plugins/*`, {
              onlyDirectories: true,
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
          const ejsFiles = await eggBornUtils.tools.globbyAsync(`${pathDist}/${dir}/**/*.ejs`);
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
      const languages = site.language ? site.language.items.split(',') : [null];
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
        const plugin = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.plugin');
        if (!module.info.public && plugin) {
          site._watchers.push(path.join(module.root, 'backend/cms'));
          // site._watchers.push(path.join(module.root, 'backend/src'));
        }
      }

      // theme
      const __themeName = this._getThemeName({ site, language });
      const themeName = __themeName.themeName;
      language = __themeName.language;
      this.watcherThemes(site, themeName);

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
      const languages = site.language ? site.language.items.split(',') : [null];
      for (const language of languages) {
        items += `  <sitemap>
    <loc>${urlRawRoot}${!site.language || language === site.language.default ? '' : '/' + language}/sitemap.xml</loc>
  </sitemap>
`;
      }
      const content = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}</sitemapindex>`;
      // write
      const pathRawDist = await this.getPathRawDist(site);
      await fse.outputFile(`${pathRawDist}/sitemapindex.xml`, content);
    }

    async createRobots({ site }) {
      // content
      const urlRawRoot = this.getUrlRawRoot(site);
      const content = `User-agent: *
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
      if (!module) this.ctx.throw.module(moduleInfo.relativeName, 1003, themeModuleName);
      // extend
      const moduleExtend = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.extend');
      if (moduleExtend) {
        await this._copyThemes(pathIntermediate, moduleExtend);
      }
      // current
      const themePath = path.join(module.root, 'backend/cms/theme');
      const themeFiles = await eggBornUtils.tools.globbyAsync(`${themePath}/*`, { onlyFiles: false });
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
      if (!module) this.ctx.throw.module(moduleInfo.relativeName, 1003, themeModuleName);
      // extend
      const moduleExtend = this.ctx.bean.util.getProperty(module, 'package.eggBornModule.cms.extend');
      if (moduleExtend) {
        this._watcherThemes(site, moduleExtend);
      }
      // current
      if (!module.info.public) {
        site._watchers.push(path.join(module.root, 'backend/cms'));
        // site._watchers.push(path.join(module.root, 'backend/src'));
      }
    }

    async _checkIfSiteBuilt({ site, force }) {
      // check if build site first
      const pathIntermediate = await this.getPathIntermediate(site.language && site.language.current);
      const fileName = path.join(pathIntermediate, 'main/article.ejs');
      const exists = await fse.pathExists(fileName);
      if (exists || !force) return exists;
      // force build
      const build = this.ctx.bean.cms.build({ atomClass: site.atomClass });
      await build.buildLanguage({ language: site.language && site.language.current });
      return true;
    }

    async getArticleUrl({ key, options }) {
      // options
      const returnPhysicalPath = options && options.returnPhysicalPath;
      const returnWaitingPath = options && options.returnWaitingPath;
      // article
      const article = await this.ctx.bean.cms.render.getArticle({ key, inner: true });
      if (!article) this.ctx.throw.module('a-base', 1002);
      if (!article.url) return null; // not throw error
      // articleUrl
      let articleUrl = article.url;
      // site
      const site = await this.getSite({ language: article.atomLanguage });
      // check if build site first
      const siteBuilt = await this._checkIfSiteBuilt({ site, force: false });
      if (!siteBuilt) this.ctx.throw.module(moduleInfo.relativeName, 1006);
      // fileName
      const pathDist = await this.getPathDist(site, article.atomLanguage);
      const fileName = path.join(pathDist, articleUrl);
      const exists = await fse.pathExists(fileName);
      if (!exists && !returnWaitingPath) {
        return null; // not throw error
      }
      if (!exists && returnWaitingPath) {
        // force to post a render task: special for draft and private articles
        const inner = article.atomStage === 0;
        await this.ctx.bean.cms.render._renderArticlePush({
          atomClass: this.atomClass,
          key: { atomId: article.atomId },
          inner,
        });
        // waiting path
        articleUrl = `static/waiting.html?atomId=${article.atomId}`;
      }
      // ok
      const url = this.getUrl(site, site.language && site.language.current, articleUrl);
      const res = {
        relativeUrl: articleUrl,
        url,
      };
      if (returnPhysicalPath) {
        res.physicalPath = fileName;
      }
      return res;
    }

    getAtomClassFullName(atomClass) {
      return `${atomClass.module}:${atomClass.atomClassName}`;
    }

    async getFrontEnvs({ language }) {
      const envs = {};
      for (const module of this.ctx.app.meta.modulesArray) {
        // may be more atoms
        const atoms = this.ctx.bean.util.getProperty(module, 'main.meta.base.atoms');
        if (!atoms) continue;
        for (const key in atoms) {
          if (atoms[key].info.cms !== true) continue;
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
              site = await this.ctx.bean.cms.site.getSite({
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
      return envs;
    }
  }

  return Build;
};


/***/ }),

/***/ 4806:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Render {
    async getArticleUrl({ atomClass, key, options }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getArticleUrl({ key, options });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.combineSiteBase({ mergeConfigSite });
    }

    async getArticle({ key, inner }) {
      if (!inner) {
        // check right
        const roleAnonymous = await ctx.bean.role.getSystemRole({ roleName: 'anonymous' });
        const right = await ctx.bean.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return null;
      }
      // article
      const article = await ctx.bean.atom.read({ key, user: { id: 0 } });
      if (!article) return null;
      // maybe site.language is false
      // // check atomLanguage
      // if (!article.atomLanguage) {
      //   article.atomLanguage = ctx.locale;
      //   // return null;
      //   // ctx.throw(1001);
      // }
      return article;
    }

    async _deleteArticlePushAsync({ atomClass, key, article, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(async () => {
        // queue
        await ctx.meta.util.queuePushAsync({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass,
            key,
            article,
            inner,
          },
        });
      });
    }

    async _deleteArticlePush({ atomClass, key, article, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(() => {
        // queue
        ctx.meta.util.queuePush({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass,
            key,
            article,
            inner,
          },
        });
      });
    }

    async _renderArticlePushAsync({ atomClass, key, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(async () => {
        // queue
        await ctx.meta.util.queuePushAsync({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass,
            key,
            inner,
          },
        });
      });
    }

    async _renderArticlePush({ atomClass, key, inner }) {
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      }
      ctx.tail(() => {
        // queue
        ctx.meta.util.queuePush({
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass,
            key,
            inner,
          },
        });
      });
    }
  }

  return Render;
};


/***/ }),

/***/ 7698:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(5638);
const fse = require3('fs-extra');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Site {
    async getSite({ atomClass, language, options }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getSite({ language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigSite();
    }

    // save site config
    async setConfigSite({ atomClass, data }) {
      // build
      const build = ctx.bean.cms.build({ atomClass });
      // save
      await build.setConfigSite({ data });
      // only in development
      if (ctx.app.meta.isLocal) {
        // build site
        this.buildLanguagesQueue({ atomClass });
        // register watchers
        await build.registerWatchers();
      }
    }

    async getConfigLanguagePreview({ atomClass, language }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigLanguagePreview({ language });
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigLanguage({ language });
    }

    // save language config
    async setConfigLanguage({ atomClass, language, data }) {
      // build
      const build = ctx.bean.cms.build({ atomClass });
      // save
      await build.setConfigLanguage({ language, data });
      // only in development
      if (ctx.app.meta.isLocal) {
        // build site
        this.buildLanguageQueue({ atomClass, language });
        // register watcher
        await build.registerWatcher({ language });
      }
    }

    async getLanguages({ atomClass }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getLanguages();
    }

    async getUrl({ atomClass, language, path }) {
      const build = ctx.bean.cms.build({ atomClass });
      const site = await build.getSite({ language });
      // check if build site first
      const siteBuilt = await build._checkIfSiteBuilt({ site, force: false });
      if (!siteBuilt) ctx.throw.module(moduleInfo.relativeName, 1006);
      return build.getUrl(site, language, path);
    }

    buildLanguagesQueue({ atomClass, progressId }) {
      // queue
      ctx.meta.util.queuePush({
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
      ctx.meta.util.queuePush({
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

      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);

      const _language = language === 'default' ? undefined : language;

      // atoms
      stats.atoms = await ctx.bean.atom.count({
        atomClass,
        options: {
          language: _language,
          mode: 'default',
        },
      });

      // comments
      stats.comments = await ctx.bean.atom.count({
        atomClass,
        options: {
          language: _language,
          mode: 'default',
          comment: 1,
        },
      });

      // categories
      if (atomClassBase.category) {
        stats.categories = await ctx.bean.category.count({
          atomClass,
          language: _language,
        });
      }

      // tags
      if (atomClassBase.tag) {
        stats.tags = await ctx.bean.tag.count({
          atomClass,
          language: _language,
        });
      }

      // ok
      return stats;
    }

    async checkFile({ atomId, file, mtime, user }) {
      // check right
      let mtimeCurrent;
      let article;
      if (file) {
        if (!ctx.app.meta.isTest && !ctx.app.meta.isLocal) ctx.throw(403);
        // exists
        const exists = await fse.pathExists(file);
        if (!exists) {
          // deleted
          return null;
        }
        // stat
        const stat = await fse.stat(file);
        mtimeCurrent = stat.mtime.valueOf();
      } else {
        article = await ctx.bean.cms.render.getArticle({ key: { atomId }, inner: true });
        if (!article) ctx.throw.module('a-base', 1002);
        // only author
        if (article.userIdUpdated !== user.id) ctx.throw(403);
        mtimeCurrent = article.renderAt ? article.renderAt.getTime() : 0;
      }

      if (mtime !== mtimeCurrent) {
        // different
        return { mtime: mtimeCurrent, article };
      }
      // default
      return null;
    }
  }

  return Site;
};


/***/ }),

/***/ 9083:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const data = context.data;
      const queueAction = data.queueAction;
      return await this[queueAction](data);
    }

    async buildLanguage({ atomClass, language, progressId }) {
      const build = this.ctx.bean.cms.build({ atomClass });
      return await build.buildLanguage({ language, progressId });
    }

    async buildLanguages({ atomClass, progressId }) {
      const build = this.ctx.bean.cms.build({ atomClass });
      return await build.buildLanguages({ progressId });
    }

    async renderArticle({ atomClass, key, inner }) {
      const build = this.ctx.bean.cms.build({ atomClass });
      return await build.renderArticle({ key, inner });
    }

    async deleteArticle({ atomClass, key, article, inner }) {
      const build = this.ctx.bean.cms.build({ atomClass });
      return await build.deleteArticle({ key, article, inner });
    }
  }

  return Queue;
};


/***/ }),

/***/ 7421:
/***/ ((module) => {

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // only in development
      if (!app.meta.isLocal) return;
      await this._registerCms();
    }

    async _registerCms() {
      // loop modules
      for (const module of app.meta.modulesArray) {
        // loop atomClasses
        const atoms = this.ctx.bean.util.getProperty(module, 'main.meta.base.atoms');
        if (!atoms) continue;
        for (const key in atoms) {
          if (atoms[key].info.cms !== true) continue;
          // atomClass
          const atomClass = {
            module: module.info.relativeName,
            atomClassName: key,
            atomClassIdParent: 0,
          };
          const build = this.ctx.bean.cms.build({ atomClass });
          await build.registerWatchers();
        }
      }
    }
  }

  return Startup;
};


/***/ }),

/***/ 9494:
/***/ ((module) => {

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // only in development
      if (!app.meta.isLocal) return;
      await this._registerDevelopment();
    }

    async _registerDevelopment() {
      // info
      const watcherInfo = { development: true, watchers: null };
      // register
      this.app.meta['a-cms:watcher'].register(watcherInfo);
    }
  }

  return Startup;
};


/***/ }),

/***/ 6899:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const version_0 = __webpack_require__(3575);
const update_1 = __webpack_require__(2180);
const update_2 = __webpack_require__(713);
const update_3 = __webpack_require__(302);
const update_4 = __webpack_require__(1362);
const update_5 = __webpack_require__(8679);
const update_6 = __webpack_require__(2694);
const update_7 = __webpack_require__(7936);
const update_8 = __webpack_require__(6867);
const update_9 = __webpack_require__(9741);
const update_10 = __webpack_require__(7996);
const update_11 = __webpack_require__(6085);
const update_12 = __webpack_require__(6051);
const init_1 = __webpack_require__(65);
const init_12 = __webpack_require__(8894);
const test = __webpack_require__(8775);

module.exports = app => {
  const classes = [
    update_1, //
    update_2,
    update_3,
    update_4,
    update_5,
    update_6,
    update_7,
    update_8,
    update_9,
    update_10,
    update_11,
    update_12,
    init_1,
    init_12,
    test,
  ];
  return app.meta.util.mixinClasses(version_0, classes, app);
};


/***/ }),

/***/ 3575:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        await this._update_1(options);
      }
      if (options.version === 2) {
        await this._update_2(options);
      }
      if (options.version === 3) {
        await this._update_3(options);
      }
      if (options.version === 4) {
        await this._update_4(options);
      }
      if (options.version === 5) {
        await this._update_5(options);
      }
      if (options.version === 6) {
        await this._update_6(options);
      }
      if (options.version === 7) {
        await this._update_7(options);
      }
      if (options.version === 8) {
        await this._update_8(options);
      }
      if (options.version === 9) {
        await this._update_9(options);
      }
      if (options.version === 10) {
        await this._update_10(options);
      }
      if (options.version === 11) {
        await this._update_11(options);
      }
      if (options.version === 12) {
        await this._update_12(options);
      }
    }

    async init(options) {
      if (options.version === 1) {
        await this._init_1(options);
      }
      if (options.version === 12) {
        await this._init_12(options);
      }
    }

    async test() {
      await this._test();
    }
  }

  return Version;
};


/***/ }),

/***/ 65:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _init_1(options) {
      // create roles: cms-writer to template
      const roles = ['cms-writer'];
      const roleTemplate = await this.ctx.bean.role.getSystemRole({ roleName: 'template' });
      const roleSuperuser = await this.ctx.bean.role.getSystemRole({ roleName: 'superuser' });
      for (const roleName of roles) {
        const roleId = await this.ctx.bean.role.add({
          roleName,
          roleIdParent: roleTemplate.id,
        });
        // role:superuser include cms-writer
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
        { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
        { roleName: 'root', action: 'read', scopeNames: 0 },
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });
    }
  }
  return Version;
};


/***/ }),

/***/ 8894:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _init_12(options) {
      // add role rights
      const roleRights = [
        { roleName: 'root', action: 'layout', scopeNames: 'root' }, //
        { roleName: 'root', action: 'preview', scopeNames: 'root' }, //
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });
    }
  }
  return Version;
};


/***/ }),

/***/ 8775:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _test() {
      const atomClass = {
        module: moduleInfo.relativeName,
        atomClassName: 'article',
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

/***/ 2180:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_1(options) {
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
  }
  return Version;
};


/***/ }),

/***/ 7996:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_10(options) {
      // alter table: aCmsArticle
      const sql = `
      ALTER TABLE aCmsArticle
        ADD COLUMN imageCover varchar(255) DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
    }
  }
  return Version;
};


/***/ }),

/***/ 6085:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_11(options) {
      // alter table: aCmsArticle
      const sql = `
      ALTER TABLE aCmsArticle
        ADD COLUMN renderAt timestamp DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
    }
  }
  return Version;
};


/***/ }),

/***/ 6051:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_12(options) {
      await this._update12Migration(options);
    }

    async _update12Migration(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: '_update12MigrationInstance',
        });
      }
    }

    async _update12MigrationInstance() {
      // articles/post
      await this._update12Migration_articles();
    }

    async _update12Migration_articles() {
      // first, hold articles
      const articles = await this.ctx.model.query(
        `
        select a.id as atomId,a.atomClassId,a.atomStage,a.userIdCreated,b.content
           from aAtom a
           left join aCmsContent b on a.id=b.atomId
            where a.iid=? and a.deleted=0 and a.atomStage=1
              and ( 
                        b.content like '%cms-pluginblock:blockAudio%'
                    or  b.content like '%cms-pluginblock:blockIFrame%'
                    or  b.content like '%cabloy-dashboard:blockCourse%'
                  )   
        `,
        [this.ctx.instance.id]
      );
      // then, update all articles
      await this.ctx.model.query(`
      update aCmsContent set content = replace (content,'cms-pluginblock:blockAudio','a-markdownblock:audio') where content like '%cms-pluginblock:blockAudio%'
    `);
      await this.ctx.model.query(`
      update aCmsContent set content = replace (content,'cms-pluginblock:blockIFrame','a-markdownblock:iframe') where content like '%cms-pluginblock:blockIFrame%'
    `);
      await this.ctx.model.query(`
      update aCmsContent set content = replace (content,'cabloy-dashboard:blockCourse','cabloy-course:blockCourseCodes') where content like '%cabloy-dashboard:blockCourse%'
    `);
      // loop
      for (const article of articles) {
        await this._update12Migration_article({ article });
      }
    }

    async _update12Migration_article({ article }) {
      // user
      const user = { id: article.userIdCreated };
      // open
      const res = await this.ctx.bean.atom.openDraft({ key: { atomId: article.atomId }, user });
      const draftKey = res.draft.key;
      // content
      let content = article.content;
      content = content.replace(/cms-pluginblock:blockAudio/gi, 'a-markdownblock:audio');
      content = content.replace(/cms-pluginblock:blockIFrame/gi, 'a-markdownblock:iframe');
      content = content.replace(/cabloy-dashboard:blockCourse/gi, 'cabloy-course:blockCourseCodes');
      // write
      await this.ctx.bean.atom.write({
        key: draftKey,
        target: null,
        item: {
          content,
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
  }
  return Version;
};


/***/ }),

/***/ 713:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_2(options) {
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
  }
  return Version;
};


/***/ }),

/***/ 302:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_3(options) {
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
  }
  return Version;
};


/***/ }),

/***/ 1362:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_4(options) {
      // alter table: aCmsCategory
      const sql = `
      ALTER TABLE aCmsCategory
        ADD COLUMN url varchar(255) DEFAULT NULL
                `;
      await this.ctx.model.query(sql);
    }
  }
  return Version;
};


/***/ }),

/***/ 8679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(9294);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_5(options) {
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

    async _update5AtomClassIds(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.meta.util.executeBean({
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
        [atomClass.id, this.ctx.instance.id]
      );
      // update aCmsTag's atomClassId
      await this.ctx.model.query(
        `update aCmsTag set atomClassId=?
             where iid=?`,
        [atomClass.id, this.ctx.instance.id]
      );
    }
  }
  return Version;
};


/***/ }),

/***/ 2694:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(5638);
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_6(options) {
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

    async _update6Uuids(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.meta.util.executeBean({
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

/***/ 7936:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_7(options) {
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

    async _update7Migration(options) {
      // all instances
      const instances = await this.ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await this.ctx.meta.util.executeBean({
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

    async _update7Migration_articles({ mapCagetoryIds, mapTagIds }) {
      // articles
      const articles = await this.ctx.model.query(
        `
        select a.*,b.userIdCreated,c.tags
           from aCmsArticle a
           left join aAtom b on b.id=a.atomId
           left join aCmsArticleTag c on c.atomId=a.atomId
            where a.iid=? and a.deleted=0 and b.atomStage=1
        `,
        [this.ctx.instance.id]
      );
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
        categoryIdParent = await this._update7Migration_cagetory({
          mapCagetoryIds,
          categories,
          category: categoryParent,
        });
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
  }
  return Version;
};


/***/ }),

/***/ 6867:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_8(options) {
      // schemas update for 7
      await this._update7Migration_schemas(options);
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
  }
  return Version;
};


/***/ }),

/***/ 9741:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _update_9(options) {
      // drop column: aCmsContent.itemId
      const sql = `
      ALTER TABLE aCmsContent
        DROP COLUMN itemId
    `;
      await this.ctx.db.query(sql);

      // drop view: aCmsArticleViewFull
      await this.ctx.model.query('drop view aCmsArticleViewFull');

      // drop view: aCmsArticleViewSearch
      await this.ctx.model.query('drop view aCmsArticleViewSearch');
    }
  }
  return Version;
};


/***/ }),

/***/ 5187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(6899);
const localBuild = __webpack_require__(9375);
const localRender = __webpack_require__(4806);
const localSite = __webpack_require__(7698);
const queueRender = __webpack_require__(9083);
const startupRegisterAllWatchers = __webpack_require__(7421);
const startupRegisterDevelopment = __webpack_require__(9494);
const atomArticle = __webpack_require__(4043);
const beanCms = __webpack_require__(618);
const ioMessageHotloadFile = __webpack_require__(8762);

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
    'local.render': {
      mode: 'ctx',
      bean: localRender,
    },
    'local.site': {
      mode: 'ctx',
      bean: localSite,
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
    'startup.registerDevelopment': {
      mode: 'app',
      bean: startupRegisterDevelopment,
    },
    // atom
    'atom.article': {
      mode: 'app',
      bean: atomArticle,
    },
    // global
    cms: {
      mode: 'ctx',
      bean: beanCms,
      global: true,
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

/***/ 4828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(5638);
const trimHtml = require3('@zhennann/trim-html');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomCmsBase extends app.meta.AtomBase {
    get modelArticle() {
      return this.ctx.model.module(moduleInfo.relativeName).article;
    }

    get modelContent() {
      return this.ctx.model.module(moduleInfo.relativeName).content;
    }

    get moduleConfig() {
      return this.ctx.config.module(moduleInfo.relativeName);
    }

    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // article
      const site = await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite: true });
      const editMode = this.ctx.bean.util.getProperty(site, 'edit.mode') || 0;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
      // uuid
      params.uuid = item.uuid || uuid.v4().replace(/-/g, '');
      // insert
      await this.modelArticle.insert(params);
      // add content
      await this.modelContent.insert({
        atomId: key.atomId,
        content: '',
      });
      return { atomId: key.atomId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // read: showSorting=true
      this._cms_getMeta(options, item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // select
      const showSorting = options && options.category;
      for (const item of items) {
        this._cms_getMeta(options, item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      const atomStage = item.atomStage;
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // if undefined then old
      const fields = [
        'atomLanguage',
        'slug',
        'editMode',
        'content',
        'sticky',
        'keywords',
        'description',
        'sorting',
        'flag',
        'extra',
      ];
      for (const field of fields) {
        if (item[field] === undefined) item[field] = atomOld[field];
      }
      // clone
      if (target === 'clone') {
        item.slug = null; // clear slug
      } else if (item.slug) {
        item.slug = item.slug.trim();
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
        if (imageFirst.length > 255) {
          imageFirst = '';
        }
      }
      // audio first
      let audioFirst = '';
      let audioCoverFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/\$\$\$\s*a-markdownblock:audio([\s\S]*?)\$\$\$/);
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
      if (audioCoverFirst.length > 255) {
        audioCoverFirst = '';
      }
      if (audioCoverFirst && !imageFirst) {
        imageFirst = audioCoverFirst;
      }
      // html
      const html = await this._renderContent({ item, atomId: key.atomId });
      const summary = this._parseSummary({ item, html });
      // update article
      await this.modelArticle.update(
        {
          sticky: item.sticky,
          keywords: item.keywords,
          description: item.description,
          summary,
          url,
          editMode: item.editMode,
          slug: item.slug,
          sorting: item.sorting,
          flag: item.flag,
          extra: item.extra || '{}',
          imageCover: item.imageCover,
          imageFirst,
          audioFirst,
          audioCoverFirst,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?', [
        item.content,
        html,
        this.ctx.instance.id,
        key.atomId,
      ]);

      // render
      const ignoreRender = options && options.ignoreRender;
      const renderSync = options && options.renderSync;
      if (!ignoreRender) {
        if (atomStage === 0 || atomStage === 1) {
          const inner = atomStage === 0;
          if (renderSync) {
            await this.ctx.bean.cms.render._renderArticlePushAsync({ atomClass, key, inner });
          } else {
            await this.ctx.bean.cms.render._renderArticlePush({ atomClass, key, inner });
          }
        }
      }
    }

    async _renderContent({ item, atomId }) {
      // editMode
      const editMode = item.editMode;
      // html
      let html = '';
      // not use item.html directly, for maybe handled twice
      // if (item.html) {
      //  html = item.html;
      // } else {
      if (editMode === 0) {
        // 0: custom
        //   same as plain text
        // html = item.html || '';
        html = item.content || '';
      } else if (editMode === 1) {
        // 1: markdown
        //   always renderMarkdown, for html maybe different for stage:0/1
        html = await this.ctx.bean.markdown.render({
          host: {
            atom: item,
            atomId,
          },
          content: item.content,
          locale: item.atomLanguage,
        });
      } else if (editMode === 2) {
        // 2: html
        html = item.content || '';
      } else {
        // not supported
        // do nothing
      }
      // }
      // title
      const title = this.ctx.bean.util.escapeHtml(item.atomName);
      html = `<!-- ${title} -->\r\n` + html;
      // ok
      return html;
    }

    _parseSummary({ item, html }) {
      // summary
      let summary;
      if (html) {
        const res = trimHtml(html, this.moduleConfig.article.trim);
        summary = res.html.trim();
      }
      if (!summary) {
        summary = item.description || '';
      }
      // ok
      return summary;
    }

    async delete({ atomClass, key, options, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });

      // delete article
      //   always renderSync=false
      if (atomOld.atomStage === 0) {
        await this.ctx.bean.cms.render._deleteArticlePush({ atomClass, key, article: atomOld, inner: true });
      }
      if (atomOld.atomStage === 1) {
        await this.ctx.bean.cms.render._deleteArticlePush({ atomClass, key, article: atomOld, inner: false });
      }

      // super
      await super.delete({ atomClass, key, options, user });

      // delete article
      await this.modelArticle.delete({
        atomId: key.atomId,
      });
      // delete content
      await this.modelContent.delete({
        atomId: key.atomId,
      });
    }

    _cms_getMeta(options, item, showSorting) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (item.sticky) meta.flags.push(this.ctx.text('Sticky'));
      if (item.sorting && showSorting) meta.flags.push(item.sorting);
      // meta.summary
      meta.summary = item.description || item.summary;
      // atomNameSub
      if (item.atomNameSub) {
        item.atomNameFull = `${item.atomName}: ${item.atomNameSub}`;
      }
    }
  }
  return AtomCmsBase;
};


/***/ }),

/***/ 9294:
/***/ ((module) => {

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
};


/***/ }),

/***/ 5985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(1017);
const require3 = __webpack_require__(5638);
const chokidar = require3('chokidar');
const debounce = require3('debounce');
const eggBornUtils = require3('egg-born-utils');

module.exports = function (app) {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Watcher {
    constructor() {
      this._watchers = {};
      this._freezeCounter = 0;
      this._needReload = false;
      this._reloadDebounce = debounce(() => {
        if (this._freezeCounter === 0 && this._needReload) {
          this._needReload = false;
          this._reloadByAgent();
        }
      }, 1000);
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
        app.meta.messenger.addProvider({
          name: 'a-cms:reload',
          handler: info => {
            this._reloadByApp(info);
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

    // called by app
    reload({ action }) {
      app.meta.messenger.callAgent({ name: 'a-cms:reload', data: { action } });
    }

    _getWatcherKey({ development, subdomain, atomClass }) {
      if (development) return 'development';
      return `${subdomain}&&${atomClass.module}&&${atomClass.atomClassName}`;
    }

    _getWatcherAtomClass({ development, subdomain, atomClass }) {
      const watcherKey = this._getWatcherKey({ development, subdomain, atomClass });
      if (!this._watchers[watcherKey]) {
        this._watchers[watcherKey] = {};
      }
      return this._watchers[watcherKey];
    }

    _getWatcherAtomClassLanguage({ development, subdomain, atomClass, language }) {
      const watchers = this._getWatcherAtomClass({ development, subdomain, atomClass });
      if (!watchers[language]) {
        watchers[language] = {};
      }
      return watchers[language];
    }

    // invoked in agent
    _registerLanguages({ info, watcherInfos }) {
      // clear
      const watchers = this._getWatcherAtomClass({ subdomain: info.subdomain, atomClass: info.atomClass });
      for (const language in watchers) {
        const watcherEntry = watchers[language];
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
    _register({ development, subdomain, atomClass, language, watchers }) {
      // watchers
      if (development) {
        watchers = this._collectDevelopmentWatchDirs();
      }
      // watcherEntry
      const watcherEntry = this._getWatcherAtomClassLanguage({ development, subdomain, atomClass, language });
      watcherEntry.info = { development, subdomain, atomClass, language, watchers };
      // close
      if (watcherEntry.watcher) {
        const _watcher = watcherEntry.watcher;
        if (!_watcher.__eb_closed) {
          if (_watcher.__eb_ready) {
            _watcher.close();
          } else {
            _watcher.__eb_closing = true;
          }
        }
        watcherEntry.watcher = null;
      }
      // watcher
      const _watcher = chokidar.watch(watchers).on(
        'change',
        debounce(info => {
          if (development) {
            this._developmentChange(info);
          } else {
            app.meta.messenger.callRandom({
              name: 'a-cms:watcherChange',
              data: { subdomain, atomClass, language },
            });
          }
        }, 300)
      );
      // on ready
      _watcher.once('ready', function () {
        _watcher.__eb_ready = true;
        if (_watcher.__eb_closing) {
          _watcher.close();
          _watcher.__eb_closed = true;
        }
      });
      // ok
      watcherEntry.watcher = _watcher;
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

    // invoked in agent
    _collectDevelopmentWatchDirs() {
      const pathSrc = path.resolve(app.config.baseDir, '..');
      let watchDirs = eggBornUtils.tools.globbySync(`${pathSrc}/**/backend/src`, { onlyDirectories: true });
      watchDirs = [path.join(pathSrc, 'backend/config')].concat(watchDirs);
      return watchDirs;
    }

    // invoked in agent
    _developmentChange(info) {
      app.logger.warn(`[agent:development] reload worker because ${info} changed`);
      this._reloadByApp({ action: 'now' });
    }

    // invoked in agent
    _reloadByAgent() {
      process.send({
        to: 'master',
        action: 'reload-worker',
      });
    }

    //  invoked in agent
    _reloadByApp({ action }) {
      if (action === 'now') {
        if (this._freezeCounter > 0) {
          this._needReload = true;
        } else {
          this._reloadByAgent();
        }
      } else if (action === 'freeze') {
        this._freezeCounter++;
      } else if (action === 'unfreeze') {
        this._freezeCounter--;
        if (this._freezeCounter === 0 && this._needReload) {
          this._reloadDebounce();
        }
      }
    }
  }

  return Watcher;
};


/***/ }),

/***/ 7076:
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
    registerDevelopment: {
      bean: 'registerDevelopment',
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
  config.cms = {};
  config.cms.site = {
    base: {
      title: 'my blog',
      subTitle: 'gone with the wind',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://localhost',
      rootPath: 'cms-test',
    },
    language: {
      default: 'en-us',
      items: 'en-us,zh-cn',
    },
    themes: {
      'en-us': 'cms-themeblog',
      'zh-cn': 'cms-themeblog',
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

/***/ 5624:
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

/***/ 6327:
/***/ ((module) => {

module.exports = {
  PersonalProfile: 'Profile',
  AuthorProfile: 'Author Profile',
  ArticlePrevious: 'Previous',
  ArticleNext: 'Next',
  second2: 's',
};


/***/ }),

/***/ 3072:
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
  'CMS(Base)': 'CMS(基本)',
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
  'Build Site First': '请先构建站点',
  'Cannot delete if has children': '有子元素时不允许删除',
  'Cannot delete if has articles': '有文章时不允许删除',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(6327),
  'zh-cn': __webpack_require__(3072),
};


/***/ }),

/***/ 3685:
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

/***/ 5815:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const info = {
    home: {
      mode: 'page',
      page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
    },
  };
  const content = {
    info: {
      atomClass: {
        module: moduleInfo.relativeName,
        atomClassName: 'article',
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
    atomName: 'CMS',
    atomStaticKey: 'appCms',
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

/***/ 8241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const appCms = __webpack_require__(5815);
// const appCmsInnerTest = require('./app/appCmsInnerTest.js');

module.exports = app => {
  const apps = [
    //
    appCms(app),
    // appCmsInnerTest(app),
  ];
  return apps;
};


/***/ }),

/***/ 7397:
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
    atomName: 'CMS Article Publish',
    atomStaticKey: 'flowArticlePublish',
    atomRevision: 100,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 1772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const articlePublish = __webpack_require__(7397);

module.exports = app => {
  const flowDefs = [articlePublish(app)];
  return flowDefs;
};


/***/ }),

/***/ 9020:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      list: {
        blocks: {
          items: {
            component: {
              module: 'a-cms',
              name: 'appCmsBaseMenuLayoutBlockListItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'CMS(Base)',
    atomStaticKey: 'layoutAppMenuCmsBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 3540:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'content,default',
            medium: 'content,default',
            large: 'content,default',
          },
          edit: {
            small: 'default,content',
            medium: 'default,content',
            large: 'default,content',
          },
        },
      },
    },
    layouts: {
      base: {
        extend: {
          component: {
            module: 'a-cms',
            name: 'itemLayoutExtend',
          },
        },
      },
      default: {
        title: 'LayoutInfo',
        blocks: {
          main: {
            component: {
              module: 'a-cms',
              name: 'itemLayoutBlockMobileMain',
            },
            info: true,
          },
        },
      },
      content: {
        title: 'LayoutContent',
        blocks: {
          main: {
            component: {
              module: 'a-cms',
              name: 'itemLayoutBlockMobileMain',
            },
            markdown: true,
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'CMS',
    atomStaticKey: 'layoutAtomItemCms',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 7893:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      orders: [
        { name: 'sticky', title: 'Sticky', by: 'desc', tableAlias: 'p' },
        { name: 'sorting', title: 'Sorting', by: 'asc', tableAlias: 'p' },
      ],
    },
    layouts: {
      list: {},
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
                dataIndex: 'atomCategoryName',
                title: 'Category',
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
                dataIndex: 'createdAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'updatedAt',
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
    atomName: 'CMS',
    atomStaticKey: 'layoutAtomListCms',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 3512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutAtomItemCms = __webpack_require__(3540);
const layoutAtomListCms = __webpack_require__(7893);
const layoutAppMenuCmsBase = __webpack_require__(9020);

module.exports = app => {
  const layouts = [
    //
    layoutAtomItemCms(app),
    layoutAtomListCms(app),
    layoutAppMenuCmsBase(app),
  ];
  return layouts;
};


/***/ }),

/***/ 5429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Article',
      atomStaticKey: 'createArticle',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'create',
      }),
      resourceIcon: '::add',
      appKey: 'a-cms:appCms',
      resourceRoles: 'template.cms-writer',
    },
    {
      atomName: 'Article List',
      atomStaticKey: 'listArticle',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:data-list-outline',
      appKey: 'a-cms:appCms',
      resourceRoles: 'root',
    },
  ];
  return resources;
};


/***/ }),

/***/ 2415:
/***/ ((module) => {

module.exports = app => {
  const keywords = {};
  return keywords;
};


/***/ }),

/***/ 8232:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // article
  schemas.article = {
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
      // editMode: {
      //   type: 'number',
      //   // ebType: 'text',
      //   ebTitle: 'Edit Mode',
      //   notEmpty: true,
      // },
    },
  };

  // article search
  schemas.articleSearch = {
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

/***/ 6885:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(9294);

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
      // anonymous user
      const user = await this.ctx.bean.user.anonymous();
      // select
      options.page = this.ctx.bean.util.page(options.page, false);
      const items = await this.ctx.bean.atom.select({ atomClass, options, user, pageForce: false });
      // ok
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    // attachments
    async attachments() {
      // options
      const options = this.ctx.request.body.options || {};
      options.page = this.ctx.bean.util.page(options.page, false);
      const items = await this.ctx.bean.file.attachments({
        key: this.ctx.request.body.key,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }
  }
  return ArticleController;
};


/***/ }),

/***/ 4261:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(9294);

module.exports = app => {
  class CommentController extends app.Controller {
    async all() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // options
      const options = this.ctx.request.body.options;
      // stage
      options.stage = 'formal';
      // anonymous user
      const user = await this.ctx.bean.user.anonymous();
      // comment
      options.comment = 1;
      // select
      options.page = this.ctx.bean.util.page(options.page);
      const items = await this.ctx.bean.atom.select({ atomClass, options, user });
      // ok
      this.ctx.successMore(items, options.page.index, options.page.size);
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
        options: this.ctx.request.body.options,
      });
      this.ctx.success(res);
    }
  }
  return RenderController;
};


/***/ }),

/***/ 8262:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
        orders: [['a.updatedAt', 'desc']],
        page: { index: 0 },
        mode: 'default',
      };
      // select
      const res = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/cms/article/list',
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = this.ctx.bean.cms.build({ atomClass });
      // site
      const site = await build.getSite({ language });
      // feed
      let feed = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[${site.base.title}]]></title>
    <link>${build.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const article of list) {
        feed += `
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
      feed += `
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
        orders: [['h_updatedAt', 'desc']],
        page: { index: 0 },
      };
      // select
      const res = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/cms/comment/all',
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = this.ctx.bean.cms.build({ atomClass });
      // site
      const site = await build.getSite({ language });
      // feed
      let feed = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments for ${site.base.title}]]></title>
    <link>${build.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const item of list) {
        feed += `
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
      feed += `
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
      const article = await this.ctx.bean.cms.render.getArticle({ key: { atomId }, inner: false });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // language
      const language = article.atomLanguage;
      // options
      const options = {
        orders: [['updatedAt', 'desc']],
        page: { index: 0 },
      };
      const res = await this.ctx.meta.util.performAction({
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
      const build = this.ctx.bean.cms.build({ atomClass });
      // site
      const site = await build.getSite({ language });
      // feed
      let feed = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments on: ${article.atomName}]]></title>
    <link>${build.getUrl(site, language, article.url)}</link>
    <description><![CDATA[${article.description || article.summary}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const item of list) {
        feed += `
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
      feed += `
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

/***/ 8683:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(9294);

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
      // check demo
      this.ctx.bean.util.checkDemo();
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
      // check demo
      this.ctx.bean.util.checkDemo();
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.setConfigLanguage({
        atomClass,
        language: this.ctx.request.body.language,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async buildLanguage() {
      // check demo
      this.ctx.bean.util.checkDemo();
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
      // check demo
      this.ctx.bean.util.checkDemo();
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
        atomId: this.ctx.request.body.atomId,
        file: this.ctx.request.body.file,
        mtime: this.ctx.request.body.mtime,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }
  return SiteController;
};


/***/ }),

/***/ 7095:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const article = __webpack_require__(6885);
const render = __webpack_require__(330);
const site = __webpack_require__(8683);
const comment = __webpack_require__(4261);
const rss = __webpack_require__(8262);

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

/***/ 9421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(7076);
const locales = __webpack_require__(25);
const errors = __webpack_require__(5624);
const WatcherFn = __webpack_require__(5985);
const AtomCmsBaseFn = __webpack_require__(4828);

module.exports = app => {
  // watcher: only in development
  if (app.meta.isLocal) {
    app.meta['a-cms:watcher'] = new (WatcherFn(app))();
  }

  // atomCmsBase
  app.meta.AtomCmsBase = AtomCmsBaseFn(app);

  // beans
  const beans = __webpack_require__(5187)(app);
  // routes
  const routes = __webpack_require__(3825)(app);
  // controllers
  const controllers = __webpack_require__(7095)(app);
  // services
  const services = __webpack_require__(7214)(app);
  // models
  const models = __webpack_require__(3230)(app);
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
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const keywords = __webpack_require__(2415)(app);
  const schemas = __webpack_require__(8232)(app);
  const socketioHotloadFile = __webpack_require__(3685)(app);
  const staticApps = __webpack_require__(8241)(app);
  const staticFlowDefs = __webpack_require__(1772)(app);
  const staticResources = __webpack_require__(5429)(app);
  const staticLayouts = __webpack_require__(3512)(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            bean: 'article',
            title: 'Article',
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
          },
          actions: {
            preview: {
              code: 101,
              title: 'Preview',
              actionModule: moduleInfo.relativeName,
              actionComponent: 'action',
              icon: { f7: '::preview' },
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'draft,formal',
            },
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
        'a-app.app': {
          items: staticApps,
        },
        'a-flow.flowDef': {
          items: staticFlowDefs,
        },
        'a-base.resource': {
          items: staticResources,
        },
        'a-baselayout.layout': {
          items: staticLayouts,
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
      keywords,
      schemas: {
        article: schemas.article,
        articleSearch: schemas.articleSearch,
      },
    },
    settings: {
      instance: {
        actionPath: 'config/atomClasses',
      },
    },
    event: {
      implementations: {},
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

/***/ 6645:
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

/***/ 2504:
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

/***/ 3230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const article = __webpack_require__(6645);
const content = __webpack_require__(2504);

module.exports = app => {
  const models = {
    article,
    content,
  };
  return models;
};


/***/ }),

/***/ 3825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // article
    { method: 'post', path: 'article/list', controller: 'article' },
    { method: 'post', path: 'article/attachments', controller: 'article' },
    // comment
    { method: 'post', path: 'comment/all', controller: 'comment' },
    // render
    {
      method: 'post',
      path: 'render/getArticleUrl',
      controller: 'render',
      meta: { right: { type: 'atom', action: 'read', checkFlow: true } },
    },
    // site
    {
      method: 'post',
      path: 'site/getConfigSiteBase',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/getConfigSite',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/setConfigSite',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/getConfigLanguagePreview',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/getConfigLanguage',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/setConfigLanguage',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/buildLanguage',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'site/buildLanguages',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    { method: 'post', path: 'site/getLanguages', controller: 'site' },
    { method: 'post', path: 'site/getUrl', controller: 'site' },
    {
      method: 'post',
      path: 'site/getStats',
      controller: 'site',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    // rss
    { method: 'get', path: 'rss/feed/article/comments/:atomId', controller: 'rss', action: 'articleComments' },
    {
      method: 'get',
      path: 'rss/feed/comments/:module/:atomClassName/:language',
      controller: 'rss',
      action: 'feedComments',
    },
    { method: 'get', path: 'rss/feed/:module/:atomClassName/:language', controller: 'rss', action: 'feed' },
    // site
    { method: 'post', path: 'site/checkFile', controller: 'site' },
  ];
  return routes;
};


/***/ }),

/***/ 4020:
/***/ ((module) => {

module.exports = app => {
  class Render extends app.Service {
    async getArticleUrl({ atomClass, key, options }) {
      return await this.ctx.bean.cms.render.getArticleUrl({ atomClass, key, options });
    }

    // site<plugin<theme<site(db)<language(db)
    async combineSiteBase({ atomClass, mergeConfigSite }) {
      return await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite });
    }
  }

  return Render;
};


/***/ }),

/***/ 9327:
/***/ ((module) => {

module.exports = app => {
  class Site extends app.Service {
    async getSite({ atomClass, language, options }) {
      return await this.ctx.bean.cms.site.getSite({ atomClass, language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      return await this.ctx.bean.cms.site.getConfigSiteBase({ atomClass });
    }

    async getConfigSite({ atomClass }) {
      return await this.ctx.bean.cms.site.getConfigSite({ atomClass });
    }

    // save site config
    async setConfigSite({ atomClass, data }) {
      return await this.ctx.bean.cms.site.setConfigSite({ atomClass, data });
    }

    async getConfigLanguagePreview({ atomClass, language }) {
      return await this.ctx.bean.cms.site.getConfigLanguagePreview({ atomClass, language });
    }

    async getConfigLanguage({ atomClass, language }) {
      return await this.ctx.bean.cms.site.getConfigLanguage({ atomClass, language });
    }

    // save language config
    async setConfigLanguage({ atomClass, language, data }) {
      return await this.ctx.bean.cms.site.setConfigLanguage({ atomClass, language, data });
    }

    async getLanguages({ atomClass }) {
      return await this.ctx.bean.cms.site.getLanguages({ atomClass });
    }

    async getUrl({ atomClass, language, path }) {
      return await this.ctx.bean.cms.site.getUrl({ atomClass, language, path });
    }

    buildLanguagesQueue({ atomClass, progressId }) {
      this.ctx.bean.cms.site.buildLanguagesQueue({ atomClass, progressId });
    }

    buildLanguageQueue({ atomClass, language, progressId }) {
      this.ctx.bean.cms.site.buildLanguageQueue({ atomClass, language, progressId });
    }

    async getStats({ atomClass, languages }) {
      return await this.ctx.bean.cms.site.getStats({ atomClass, languages });
    }

    async checkFile({ atomId, file, mtime, user }) {
      return await this.ctx.bean.cms.site.checkFile({ atomId, file, mtime, user });
    }
  }

  return Site;
};


/***/ }),

/***/ 7214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const render = __webpack_require__(4020);
const site = __webpack_require__(9327);

module.exports = app => {
  const services = {
    render,
    site,
  };
  return services;
};


/***/ }),

/***/ 5638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

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
/******/ 	var __webpack_exports__ = __webpack_require__(9421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map