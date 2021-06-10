const require3 = require('require3');
const fse = require3('fs-extra');

let __blocks = null;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Site {

    async getSite({ atomClass, language, options }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getSite({ language, options });
    }

    async getConfigSiteBase({ atomClass }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigSiteBase();
    }

    async getConfigSite({ atomClass }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigSite();
    }

    // save site config
    async setConfigSite({ atomClass, data }) {
      // build
      const build = ctx.bean.cms.build({ atomClass });
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
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigLanguagePreview({ language });
    }

    async getConfigLanguage({ atomClass, language }) {
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getConfigLanguage({ language });
    }

    // save language config
    async setConfigLanguage({ atomClass, language, data }) {
      // build
      const build = ctx.bean.cms.build({ atomClass });
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
      const build = ctx.bean.cms.build({ atomClass });
      return await build.getLanguages();
    }

    async getUrl({ atomClass, language, path }) {
      const build = ctx.bean.cms.build({ atomClass });
      const site = await build.getSite({ language });
      // check if build site first
      const siteBuilt = await build._checkIfSiteBuilt({ site, force: false });
      if (!siteBuilt) ctx.throw.module(moduleInfo.relativeName, 1006);
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

      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);

      const _language = language === 'default' ? undefined : language;

      // atoms
      stats.atoms = await ctx.bean.atom.count({
        atomClass,
        options: {
          language: _language,
          mode: 'default',
        },
      });

      // comments
      stats.comments = await ctx.bean.atom.count({
        atomClass,
        options: {
          language: _language,
          mode: 'default',
          comment: 1,
        },
      });

      // categories
      if (atomClassBase.category) {
        stats.categories = await ctx.bean.category.count({
          atomClass, language: _language,
        });
      }

      // tags
      if (atomClassBase.tag) {
        stats.tags = await ctx.bean.tag.count({
          atomClass, language: _language,
        });
      }

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
      for (const module of ctx.app.meta.modulesArray) {
        const _blocksModule = ctx.bean.util.getProperty(module, 'main.meta.cms.plugin.blocks');
        if (_blocksModule) {
          const blocksModule = this._prepareBlocksModule({ module, blocks: _blocksModule });
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
        const block = blocks[key];
        // validator
        let validator = block.validator;
        if (typeof validator === 'string') {
          validator = {
            module: moduleName,
            validator,
          };
        } else {
          validator = {
            module: validator.module || moduleName,
            validator: validator.validator,
          };
        }
        // beanFullName
        const beanName = block.bean;
        let beanFullName;
        if (typeof beanName === 'string') {
          beanFullName = `${moduleName}.cms.block.${beanName}`;
        } else {
          beanFullName = `${beanName.module || moduleName}.cms.block.${beanName.name}`;
        }
        // ok
        blocksModule[fullName] = {
          ... block,
          validator,
          beanFullName,
        };
      }
      return blocksModule;
    }

    async checkFile({ atomId, file, mtime, user }) {
      // check right
      let mtimeCurrent;
      if (file) {
        if (!ctx.app.meta.isTest && !ctx.app.meta.isLocal) ctx.throw(403);
        // exists
        const exists = await fse.pathExists(file);
        if (!exists) {
          // deleted
          return null;
        }
        // stat
        const stat = await fse.stat(file);
        mtimeCurrent = stat.mtime.valueOf();
      } else {
        const article = await ctx.bean.cms.render.getArticle({ key: { atomId }, inner: true });
        if (!article) ctx.throw.module('a-base', 1002);
        // only author
        if (article.userIdUpdated !== user.id) ctx.throw(403);
        mtimeCurrent = article.renderAt ? article.renderAt.getTime() : 0;
      }

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
