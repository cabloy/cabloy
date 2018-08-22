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

  }
  return SiteController;
};

