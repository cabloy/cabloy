const require3 = require('require3');
const fse = require3('fs-extra');
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

    async buildLanguages({ atomClass, progressId }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguages({ progressId });
    }

    async buildLanguage({ atomClass, language, progressId }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguage({ language, progressId });
    }

    async checkFile({ file, mtime }) {
      // loop
      const timeStart = new Date();
      while (true) {
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
        // check the delayTimeout if the same
        const timeEnd = new Date();
        const time = (timeEnd.valueOf() - timeStart.valueOf());
        if (time >= this.ctx.config.checkFile.timeoutDelay) {
          // timeout
          return { mtime: mtimeCurrent };
        }
        // sleep 1s then continue
        await this.ctx.meta.util.sleep(1000);
      }
    }

  }

  return Site;
};
