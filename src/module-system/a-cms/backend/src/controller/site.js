const utils = require('../common/utils.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SiteController extends app.Controller {

    async getSite() {
      // not log the error
      try {
        const atomClass = this.ctx.request.body.atomClass;
        const site = await this.ctx.service.site.getSite({
          atomClass,
          language: this.ctx.request.body.language,
          options: this.ctx.request.body.options,
        });
        this.ctx.success(site);
      } catch (err) {
        this.ctx.fail(err);
      }
    }

    async getConfigSiteBase() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigSiteBase({ atomClass });
      this.ctx.success({ data });
    }

    async getConfigSite() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigSite({ atomClass });
      this.ctx.success({ data });
    }

    async setConfigSite() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.setConfigSite({
        atomClass,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async getConfigLanguagePreview() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigLanguagePreview({
        atomClass,
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async getConfigLanguage() {
      const atomClass = this.ctx.request.body.atomClass;
      const data = await this.ctx.service.site.getConfigLanguage({
        atomClass,
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async setConfigLanguage() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.setConfigLanguage({
        atomClass,
        language: this.ctx.request.body.language,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async buildLanguage() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      const language = this.ctx.request.body.language;
      // progress
      const progressId = await this.ctx.bean.progress.create();
      // build
      this.ctx.service.site.buildLanguageQueue({ atomClass, language, progressId });
      this.ctx.success({ progressId });
    }

    async buildLanguages() {
      // atomClass
      const atomClass = utils.atomClass(this.ctx.request.body.atomClass);
      // progress
      const progressId = await this.ctx.bean.progress.create();
      // build
      this.ctx.service.site.buildLanguagesQueue({ atomClass, progressId });
      this.ctx.success({ progressId });
    }

    async getLanguages() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getLanguages({ atomClass });
      this.ctx.success(res);
    }

    async getUrl() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getUrl({
        atomClass,
        language: this.ctx.request.body.language,
        path: this.ctx.request.body.path,
      });
      this.ctx.success(res);
    }

    async getBlocks() {
      const res = await this.ctx.service.site.getBlocks({
        locale: this.ctx.locale,
      });
      this.ctx.success(res);
    }

    async getBlockArray() {
      const res = await this.ctx.service.site.getBlockArray({
        locale: this.ctx.locale,
      });
      this.ctx.success(res);
    }

    async blockSave() {
      const res = await this.ctx.service.site.blockSave({
        blockName: this.ctx.request.body.blockName,
        item: this.ctx.request.body.item,
      });
      this.ctx.success(res);
    }

    async getStats() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getStats({
        atomClass,
        languages: this.ctx.request.body.languages,
      });
      this.ctx.success(res);
    }

  }
  return SiteController;
};

