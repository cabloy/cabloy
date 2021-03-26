const require3 = require('require3');
const fse = require3('fs-extra');

let __blocks = null;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Site {

    async getSite({ atomClass, language, options }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.getSite({ language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.getConfigSite();
    }

    // save site config
    async setConfigSite({ atomClass, data }) {
      // build
      const build = ctx.build.cms.build({ atomClass });
      // save
      await build.setConfigSite({ data });
      // only in development
      if (ctx.app.meta.isLocal) {
        // build site
        this.buildLanguagesQueue({ atomClass });
        // register watchers
        await build.registerWatchers();
      }
    }

    async getConfigLanguagePreview({ atomClass, language }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.getConfigLanguagePreview({ language });
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.getConfigLanguage({ language });
    }

    // save language config
    async setConfigLanguage({ atomClass, language, data }) {
      // build
      const build = ctx.build.cms.build({ atomClass });
      // save
      await build.setConfigLanguage({ language, data });
      // only in development
      if (ctx.app.meta.isLocal) {
        // build site
        this.buildLanguageQueue({ atomClass, language });
        // register watcher
        await build.registerWatcher({ language });
      }
    }

    async getLanguages({ atomClass }) {
      const build = ctx.build.cms.build({ atomClass });
      return await build.getLanguages();
    }

    async getUrl({ atomClass, language, path }) {
      const build = ctx.build.cms.build({ atomClass });
      const site = await build.getSite({ language });
      return build.getUrl(site, language, path);
    }

    buildLanguagesQueue({ atomClass, progressId }) {
      // queue
      ctx.app.meta.queue.push({
        locale: ctx.locale,
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguages',
          atomClass,
          progressId,
        },
      });
    }

    buildLanguageQueue({ atomClass, language, progressId }) {
      // queue
      ctx.app.meta.queue.push({
        locale: ctx.locale,
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguage',
          atomClass,
          language,
          progressId,
        },
      });
    }

    async getStats({ atomClass, languages }) {
      const res = {};
      for (const language of languages) {
        res[language] = await this._getStatsLanguange({ atomClass, language });
      }
      return res;
    }

    async _getStatsLanguange({ atomClass, language }) {
      const stats = {};

      // articles
      stats.articles = await ctx.bean.atom.count({
        atomClass,
        options: {
          language,
          mode: 'default',
        },
      });

      // comments
      stats.comments = await ctx.bean.atom.count({
        atomClass,
        options: {
          language,
          mode: 'default',
          comment: 1,
        },
      });

      // categories
      stats.categories = await ctx.bean.category.count({
        atomClass, language,
      });

      // tags
      stats.tags = await ctx.bean.tag.count({
        atomClass, language,
      });

      // ok
      return stats;
    }

    async blockSave({ blockName, item }) {
      // block
      const blocks = this.getBlocks();
      const block = blocks[blockName];
      // validate
      await ctx.bean.validation.validate({
        module: block.validator.module,
        validator: block.validator.validator,
        schema: null,
        data: item,
      });
      // output
      if (!block.output) return item;
      return await block.output({ ctx, block, data: item });
    }

    getBlocks() {
      if (!__blocks) {
        __blocks = this._prepareBlocks();
      }
      return __blocks;
    }

    _prepareBlocks() {
      const blocks = {};
      // (X) modulesArray for block override
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.cms &&
          module.main.meta.cms.plugin && module.main.meta.cms.plugin.blocks) {
          const blocksModule = this._prepareBlocksModule({ module, blocks: module.main.meta.cms.plugin.blocks });
          Object.assign(blocks, blocksModule);
        }
      }
      return blocks;
    }

    _prepareBlocksModule({ module, blocks }) {
      const blocksModule = {};
      const moduleName = module.info.relativeName;
      for (const key in blocks) {
        const fullName = `${moduleName}:${key}`;
        blocksModule[fullName] = blocks[key];
      }
      return blocksModule;
    }

    async checkFile({ file, mtime }) {
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
      // default
      return null;
    }

  }

  return Site;
};
