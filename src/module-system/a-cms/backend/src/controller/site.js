module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SiteController extends app.Controller {

    async getConfigSiteBase() {
      const data = await this.ctx.service.site.getConfigSiteBase();
      this.ctx.success({ data });
    }

    async getConfigSite() {
      const data = await this.ctx.service.site.getConfigSite();
      this.ctx.success({ data });
    }

    async setConfigSite() {
      const res = await this.ctx.service.site.setConfigSite({
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async getConfigLanguagePreview() {
      const data = await this.ctx.service.site.getConfigLanguagePreview({
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async getConfigLanguage() {
      const data = await this.ctx.service.site.getConfigLanguage({
        language: this.ctx.request.body.language,
      });
      this.ctx.success({ data });
    }

    async setConfigLanguage() {
      const res = await this.ctx.service.site.setConfigLanguage({
        language: this.ctx.request.body.language,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async buildLanguage() {
      // queue
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'queueBuildLanguage',
        data: { language: this.ctx.request.body.language },
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      // queue
      const res = await this.ctx.app.meta.queue.pushAsync({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'queueBuildLanguages',
        data: null,
      });
      this.ctx.success(res);
    }

    async getLanguages() {
      const res = await this.ctx.service.site.getLanguages();
      this.ctx.success(res);
    }

    async getUrl() {
      const res = await this.ctx.service.site.getUrl({
        language: this.ctx.request.body.language,
        path: this.ctx.request.body.path,
      });
      this.ctx.success(res);
    }

  }
  return SiteController;
};

