const fse = require('fs-extra');

const moduleInfo = module.info;
module.exports = class Site {
  async getSite({ atomClass, language, options }) {
    const build = this.ctx.bean.cms.build({ atomClass });
    return await build.getSite({ language, options });
  }

  async getConfigSiteBase({ atomClass }) {
    const build = this.ctx.bean.cms.build({ atomClass });
    return await build.getConfigSiteBase();
  }

  async getConfigSite({ atomClass }) {
    const build = this.ctx.bean.cms.build({ atomClass });
    return await build.getConfigSite();
  }

  // save site config
  async setConfigSite({ atomClass, data }) {
    // build
    const build = this.ctx.bean.cms.build({ atomClass });
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
    const build = this.ctx.bean.cms.build({ atomClass });
    return await build.getConfigLanguagePreview({ language });
  }

  async getConfigLanguage({ atomClass, language }) {
    const build = this.ctx.bean.cms.build({ atomClass });
    return await build.getConfigLanguage({ language });
  }

  // save language config
  async setConfigLanguage({ atomClass, language, data }) {
    // build
    const build = this.ctx.bean.cms.build({ atomClass });
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
    const build = this.ctx.bean.cms.build({ atomClass });
    return await build.getLanguages();
  }

  async getUrl({ atomClass, language, path }) {
    const build = this.ctx.bean.cms.build({ atomClass });
    const site = await build.getSite({ language });
    // check if build site first
    const siteBuilt = await build._checkIfSiteBuilt({ site, force: false });
    if (!siteBuilt) this.ctx.throw.module(moduleInfo.relativeName, 1006);
    return build.getUrl(site, language, path);
  }

  buildLanguagesQueue({ atomClass, progressId }) {
    // queue
    this.ctx.meta.util.queuePush({
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
    this.ctx.meta.util.queuePush({
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

    const atomClassBase = await this.ctx.bean.atomClass.atomClass(atomClass);

    const _language = language === 'default' ? undefined : language;

    // atoms
    stats.atoms = await this.ctx.bean.atom.count({
      atomClass,
      options: {
        language: _language,
        mode: 'default',
      },
    });

    // comments
    stats.comments = await this.ctx.bean.atom.count({
      atomClass,
      options: {
        language: _language,
        mode: 'default',
        comment: 1,
      },
    });

    // categories
    if (atomClassBase.category) {
      stats.categories = await this.ctx.bean.category.count({
        atomClass,
        language: _language,
      });
    }

    // tags
    if (atomClassBase.tag) {
      stats.tags = await this.ctx.bean.tag.count({
        atomClass,
        language: _language,
      });
    }

    // ok
    return stats;
  }

  async checkFile({ atomId, file, mtime, user }) {
    // check right
    let mtimeCurrent;
    let article;
    if (file) {
      if (!this.ctx.app.meta.isTest && !this.ctx.app.meta.isLocal) this.ctx.throw(403);
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
      article = await this.ctx.bean.cms.render.getArticle({ key: { atomId }, inner: true });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // only author
      if (article.userIdUpdated !== user.id) this.ctx.throw(403);
      mtimeCurrent = article.renderAt ? article.renderAt.getTime() : 0;
    }

    if (mtime !== mtimeCurrent) {
      // different
      return { mtime: mtimeCurrent, article };
    }
    // default
    return null;
  }
};
