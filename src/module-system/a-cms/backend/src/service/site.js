const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');

module.exports = app => {

  class Site extends app.Service {

    async getConfigSite() {
      return await this.ctx.meta.status.get('config-site');
    }

    async setConfigSite({ data }) {
      await this.ctx.meta.status.set('config-site', data);
    }

    async getConfigLanguage({ language }) {
      return await this.ctx.meta.status.get(`config-${language}`);
    }

    async setConfigLanguage({ language, data }) {
      await this.ctx.meta.status.set(`config-${language}`, data);
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
      const distPaths = [ 'sitemap.xml', 'index.html', 'articles', 'static', 'assets', 'plugins' ];
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
            await fse.copy(item, path.join(pathIntermediate, 'plugins', module.package.eggBornModule.cms.name, path.basename(item)));
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
  </sitemap>`;
      }
      const content =
`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
      // write
      const pathRawDist = await this.ctx.service.render.getPathRawDist(site);
      await fse.outputFile(`${pathRawDist}/sitemapindex.xml`, content);
    }

  }

  return Site;
};
