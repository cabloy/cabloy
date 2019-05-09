const require3 = require('require3');
const fse = require3('fs-extra');
const extend = require3('extend2');
const Build = require('../common/build.js');

const _blocksLocales = {};

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

    getBlocks({ locale }) {
      if (!_blocksLocales[locale]) {
        _blocksLocales[locale] = this._prepareBlocks({ locale });
      }
      return _blocksLocales[locale];
    }

    _prepareBlocks({ locale }) {
      const blocks = {};
      // modulesArray for block override
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.cms &&
          module.main.meta.cms.plugin && module.main.meta.cms.plugin.blocks) {
          const blocksModule = this._prepareBlocksModule({ locale, module, blocks: module.main.meta.cms.plugin.blocks });
          extend(true, blocks, blocksModule);
        }
      }
      return blocks;
    }

    _prepareBlocksModule({ locale, module, blocks }) {
      const blocksModule = extend(true, {}, blocks);
      for (const key in blocksModule) {
        const block = blocksModule[key];
        block.meta.module = module.relativeName;
        block.meta.titleLocale = this.ctx.text.locale(locale, block.meta.title);
      }
      return blocksModule;
    }

  }

  return Site;
};
