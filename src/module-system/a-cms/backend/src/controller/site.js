const utils = require('../common/utils.js');

module.exports =
  // const moduleInfo = module.info;
  class SiteController {
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
      // check demo
      this.ctx.bean.util.checkDemo();
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
      // check demo
      this.ctx.bean.util.checkDemo();
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.setConfigLanguage({
        atomClass,
        language: this.ctx.request.body.language,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async buildLanguage() {
      // check demo
      this.ctx.bean.util.checkDemo();
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
      // check demo
      this.ctx.bean.util.checkDemo();
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

    async getStats() {
      const atomClass = this.ctx.request.body.atomClass;
      const res = await this.ctx.service.site.getStats({
        atomClass,
        languages: this.ctx.request.body.languages,
      });
      this.ctx.success(res);
    }

    async checkFile() {
      const res = await this.ctx.service.site.checkFile({
        atomId: this.ctx.request.body.atomId,
        file: this.ctx.request.body.file,
        mtime: this.ctx.request.body.mtime,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  };
