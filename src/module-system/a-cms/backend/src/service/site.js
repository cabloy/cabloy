const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');
const extend = require3('extend2');
const Build = require('../common/build.js');

module.exports = app => {

  class Site extends app.Service {

    async getConfigSiteBase({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigSite();
    }

    async setConfigSite({ data }) {
      await this.ctx.meta.status.set('config-site', data);
    }

    async getConfigLanguagePreview({ language }) {
      const site = await this.ctx.service.render.getSite({ language });
      this._adjustConfigLanguange(site);
      return site;
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getConfigLanguage({ language });
    }

    async setConfigLanguage({ language, data }) {
      this._adjustConfigLanguange(data);
      await this.ctx.meta.status.set(`config-${language}`, data);
    }

    async getLanguages({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.getLanguages();
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

    // todo:
    async buildLanguages({ atomClass }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguages();
    }

    async buildLanguage({ atomClass, language }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguage({ language });
    }

  }

  return Site;
};
