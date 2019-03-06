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
