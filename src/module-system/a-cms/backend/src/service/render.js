const path = require('path');
const require3 = require('require3');
const ejs = require3('@zhennann/ejs');
const pMap = require3('p-map');
const extend = require3('extend2');
const uuid = require3('uuid');
const fse = require3('fs-extra');
const moment = require3('moment');
const glob = require3('glob');
const bb = require3('bluebird');

module.exports = app => {

  class Render extends app.Service {

    async renders({ key }) {
      console.time('a');
      // for (let i = 0; i < 10000; i++) {
      //   await this.render({ key });
      // }
      // 批量执行
      const mapper = () => {
        return this.render({});
      };
      const articles = [];
      for (let i = 0; i < 10000; i++) {
        articles[i] = i;
      }
      const results = await pMap(articles, mapper, { concurrency: 10 });
      console.timeEnd('a');
    }

    async renderAllFiles({ language }) {
      // clearCache
      ejs.clearCache();
      // site
      const site = await this.getSite({ language });
      // render static
      await this._renderStatic({ site });
      // render index
      await this._renderIndex({ site });
      // render articles
      await this._renderArticles({ site });
    }

    async renderArticle({ key }) {
      // clearCache
      ejs.clearCache();
      // check right
      const roleAnonymous = await this.ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
      const right = await this.ctx.meta.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
      if (!right) return;
      // article
      const article = await this.ctx.meta.atom.read({ key, user: { id: 0 } });
      if (!article) return;
      if (!article.language) this.ctx.throw(1001);
      // site
      const site = await this.getSite({ language: article.language });
      // render index
      await this._renderIndex({ site });
      // render article
      await this._renderArticle({ site, article });
      // write sitemap
      await this._writeSitemap({ site, article });
    }

    async _writeSitemap({ site, article }) {
      const loc = article.url;
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
        xml = xml.toString().replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`);
      }
      // save
      await fse.writeFile(fileName, xml);
    }

    async _renderArticles({ site }) {
      // anonymous user
      // articles
      // render article
      // write sitemap
    }

    async _renderStatic({ site }) {
      // static
      const pathIntermediate = await this.getPathIntermediate(site.language.current);
      const staticFiles = await bb.fromCallback(cb => {
        glob(`${pathIntermediate}/static/\*.ejs`, cb);
      });
      for (const item of staticFiles) {
        // data
        const data = this.getData({ site });
        // path
        const _fileName = `static/${path.basename(item, '.ejs')}.html`;
        await this._renderFile({
          fileSrc: `static/${path.basename(item)}`,
          fileDest: _fileName,
          data,
        });
      }
    }

    async _renderIndex({ site }) {
      // data
      const data = this.getData({ site });
      // path
      const _fileName = 'index.html';
      await this._renderFile({
        fileSrc: 'main/index.ejs',
        fileDest: _fileName,
        data,
      });
    }

    async _renderArticle({ site, article }) {
      // data
      const data = this.getData({ site });
      data.article = article;
      // path
      const _fileName = `articles/${uuid.v4().replace(/-/g, '')}.html`;
      await this._renderFile({
        fileSrc: 'main/article.ejs',
        fileDest: _fileName,
        data,
      });
      // url
      const url = article.url = this.getUrl(data.site, site.language.current, _fileName);
      // save
      await this.ctx.model.article.update({
        id: article.id,
        url,
      });
    }

    async _renderFile({ fileSrc, fileDest, data }) {
      // language
      const language = data.site.language.current;
      // src
      const pathIntermediate = await this.getPathIntermediate(language);
      const fileName = path.join(pathIntermediate, fileSrc);
      // data
      data._filename = fileName;
      // render
      const content = await ejs.renderFile(fileName, data, this.getOptions());
      // dest
      const pathDist = await this.getPathDist(data.site, language);
      const fileWrite = path.join(pathDist, fileDest);
      // write
      await fse.outputFile(fileWrite, content);
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
      return `${site.host.url}${site.host.rootPath ? '/' + site.host.rootPath : ''}`;
    }
    getUrlRoot(site, language) {
      const rawRoot = this.getUrlRawRoot(site);
      return `${rawRoot}${language === site.language.default ? '' : '/' + language}`;
    }
    getUrl(site, language, path) {
      const urlRoot = this.getUrlRoot(site, language);
      return `${urlRoot}/${path}`;
    }

    getData({ site }) {
      return {
        site,
        require(fileName) {
          const ch = fileName.charAt(0);
          const file = (ch !== '.' && ch !== '..') ? fileName : path.resolve(path.dirname(this._filename), fileName);
          return require(file);
        },
      };
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
      const site = extend(true, {}, this.ctx.config.site);
      // plugins
      site.plugins = {};
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.plugin) {
          site.plugins[module.package.eggBornModule.cms.name] = this.ctx.config.module(relativeName).plugin;
        }
      }
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
