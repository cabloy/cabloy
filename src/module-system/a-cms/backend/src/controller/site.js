module.exports = app => {

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
      const res = await this.ctx.service.site.buildLanguage({
        language: this.ctx.request.body.language,
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      const res = await this.ctx.service.site.buildLanguages();
      this.ctx.success(res);
    }

  }
  return SiteController;
};

