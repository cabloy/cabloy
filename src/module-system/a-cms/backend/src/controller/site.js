module.exports = app => {

  class SiteController extends app.Controller {

    async getConfigSite() {
      const res = await this.ctx.service.site.getConfigSite();
      this.ctx.success(res);
    }

    async getConfigLanguage() {
      const res = await this.ctx.service.site.getConfigLanguage({
        language: this.ctx.request.body.language,
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

