const path = require('path');
const require3 = require('require3');
const ejs = require3('ejs');
const pMap = require3('p-map');
const extend = require3('extend2');
const uuid = require3('uuid');
const fse = require3('fs-extra');

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

    async article({ key }) {
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
      await this.renderIndex({ site });
      // render article
      await this.renderArticle({ site, article });
      // todo: write to sitemap
    }

    async renderIndex({ site }) {
      // data
      const data = this.getData({ site });
      // path
      const _fileName = 'index.html';
      await this.renderFile({
        fileSrc: 'main/index.ejs',
        fileDest: _fileName,
        data,
      });
    }

    async renderArticle({ site, article }) {
      // data
      const data = this.getData({ site });
      data.article = article;
      // path
      const _fileName = `articles/${uuid.v4().replace(/-/g, '')}.html`;
      await this.renderFile({
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

    async renderFile({ fileSrc, fileDest, data }) {
      // language
      const language = data.site.language.current;
      // src
      const pathIntermediate = await this.getPathIntermediate(language, false);
      const fileName = path.join(pathIntermediate, fileSrc);
      // render
      const value = await ejs.renderFile(fileName, data, this.getOptions());
      // dest
      const pathDist = await this.getPathDist(data.site, language, false);
      const fileWrite = path.join(pathDist, fileDest);
      await fse.ensureDir(path.dirname(fileWrite));
      // write
      await fse.writeFile(fileWrite, value);
    }

    async getPathIntermediate(language, ensure) {
      return await this.ctx.meta.file.getPath(`cms/${language}/intermediate`, ensure);
    }
    async getPathDist(site, language, ensure) {
      return await this.ctx.meta.file.getPath(`cms/dist${language === site.language.default ? '' : '/' + language}`, ensure);
    }
    getUrlRoot(site, language) {
      return `${site.host.url}${site.host.rootPath ? '/' + site.host.rootPath : ''}${language === site.language.default ? '' : '/' + language}`;
    }
    getUrl(site, language, path) {
      const urlRoot = this.getUrlRoot(site, language);
      return `${urlRoot}/${path}`;
    }

    getData({ site }) {
      return {
        site,
        require: fileName => {
          console.log(fileName);
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
      const siteBase = this.combineSiteBase();
      return await this.combineSite({ siteBase, language });
    }

    // site<plugin<theme<site(db)<language(db)
    combineSiteBase() {
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
