const require3 = require('require3');
const extend = require3('extend2');

let __blocks = null;

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Site extends app.Service {

    async getSite({ atomClass, language, options }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getSite({ language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigSite();
    }

    // save site config
    async setConfigSite({ atomClass, data }) {
      // build
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      // save
      await build.setConfigSite({ data });
      // only in development
      if (this.ctx.app.meta.isLocal) {
        // build site
        this.buildLanguagesQueue({ atomClass });
        // register watchers
        await build.registerWatchers();
      }
    }

    async getConfigLanguagePreview({ atomClass, language }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigLanguagePreview({ language });
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getConfigLanguage({ language });
    }

    // save language config
    async setConfigLanguage({ atomClass, language, data }) {
      // build
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      // save
      await build.setConfigLanguage({ language, data });
      // only in development
      if (this.ctx.app.meta.isLocal) {
        // build site
        this.buildLanguageQueue({ atomClass, language });
        // register watcher
        await build.registerWatcher({ language });
      }
    }

    async getLanguages({ atomClass }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      return await build.getLanguages();
    }

    async getUrl({ atomClass, language, path }) {
      const build = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.build`, atomClass);
      const site = await build.getSite({ language });
      return build.getUrl(site, language, path);
    }

    buildLanguagesQueue({ atomClass, progressId }) {
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
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
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
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
      stats.articles = await this.ctx.bean.atom.count({
        atomClass,
        options: {
          language,
          mode: 'default',
        },
      });

      // comments
      stats.comments = await this.ctx.bean.atom.count({
        atomClass,
        options: {
          language,
          mode: 'default',
          comment: 1,
        },
      });

      // categories
      stats.categories = await this.ctx.bean.category.count({
        atomClass, language,
      });

      // tags
      stats.tags = await this.ctx.bean.tag.count({
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
      await this.ctx.bean.validation.validate({
        module: block.validator.module,
        validator: block.validator.validator,
        schema: null,
        data: item,
      });
      // output
      if (!block.data.output) return item;
      return await block.data.output({ ctx: this.ctx, block, data: item });
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

  }

  return Site;
};
