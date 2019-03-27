const require3 = require('require3');
const fse = require3('fs-extra');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SiteController extends app.Controller {

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
      const atomClass = this.ctx.request.body.atomClass;
      const language = this.ctx.request.body.language;
      // queue
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguage',
          atomClass,
          language,
        },
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      const atomClass = this.ctx.request.body.atomClass;
      // queue
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguages',
          atomClass,
        },
      });
      this.ctx.success(res);
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

    async checkFile() {
      // file
      const file = this.ctx.request.body.file;
      // mtime
      const exists = await fse.pathExists(file);
      if (!exists) {
        // deleted
        this.ctx.success(null);
      } else {
        const stats = await fse.stat(file);
        this.ctx.success({ mtime: stats.mtime });
      }
    }

  }
  return SiteController;
};

