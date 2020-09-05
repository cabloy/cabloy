const path = require('path');
const require3 = require('require3');
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
const time = require('./time.js');
const utils = require('./utils.js');

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
    const article = await this.ctx.service.article._getArticle({ key, inner });
    if (!article) return;
    // clearCache
    ejs.clearCache();
    // site
    const site = await this.getSite({ language: article.language });
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
    const user = await this.ctx.bean.user.anonymous();
    // articles
    const articles = await this.ctx.bean.atom.select({
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

