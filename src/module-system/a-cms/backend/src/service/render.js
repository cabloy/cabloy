const path = require('path');
const require3 = require('require3');
const ejs = require3('ejs');
const pMap = require3('p-map');
const extend = require3('extend2');

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
      console.log(results[0]);
      console.timeEnd('a');
    }

    async article({ siteBase, sites, clearCache, article, key }) {
      // cache
      if (clearCache) {
        // clearCache
        ejs.clearCache();
      }
      // article
      if (key) {
        // check right
        const roleAnonymous = await this.ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
        const right = await this.ctx.meta.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return;

        // article
        article = await this.ctx.meta.atom.read({ key, user: { id: 0 } });
        if (!article) return;
      }
      // siteBase
      if (!siteBase) {
        siteBase = this.combineSiteBase();
      }
      // language
      const language = article.language; // must not empty
      if (!language) this.ctx.throw(1001);
      // site
      sites = sites || {};
      let site = sites[language];
      if (!site) {
        const _site = await this.combineSite({ siteBase, language });
        site = sites[language] = _site;
      }
      // data
      const data = {
        site,
        article,
        require: fileName => {
          console.log(fileName);
        },
      };
      // path
      const fileName = await this.ctx.meta.file.getPath('cms/en-us/intermediate/main/article.ejs');
      const value = await ejs.renderFile(
        fileName,
        data,
        this.getOptions());
      console.log(value);
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
    combineSiteBase() {
      // site
      const site = extend({}, this.ctx.config.site);
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
      return extend({}, siteBase, theme, configSite, configLanguage);
    }

  }

  return Render;
};
