const path = require('path');
const require3 = require('require3');
const ejs = require3('@zhennann/ejs');
const pMap = require3('p-map');
const fse = require3('fs-extra');
const moment = require3('moment');
const eggBornUtils = require3('egg-born-utils');
const CleanCSS = require3('clean-css');
const shajs = require3('sha.js');
const babel = require3('@babel/core');
const UglifyJS = require3('uglify-js');
const less = require3('less');
const utils = require('../common/utils.js');

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
      const site = this.ctx.bean.util.extend({}, configSite);

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
          site = this.ctx.bean.util.extend(site, configSite);
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
      return this.ctx.bean.util.extend({}, siteBase, theme, configSite, configLanguage, {
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
      return this.ctx.bean.util.extend(
        {},
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
      site.front.env = this.ctx.bean.util.extend(
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
        this.ctx.bean.util.extend(_env, value);
      }
      // combine
      const env = this.ctx.bean.util.extend(site.front.env, _env);
      // front.envs
      if (site.front.envs) {
        env.envs = site.front.envs;
      }
      // article
      if (data.article) {
        env.article = this.ctx.bean.util.extend({}, data.article);
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
