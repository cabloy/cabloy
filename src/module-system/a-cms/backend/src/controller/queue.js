module.exports = app => {

  class QueueController extends app.Controller {

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

    async renderArticle() {
      const res = await this.ctx.service.render.renderArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

    async deleteArticle() {
      const res = await this.ctx.service.render.deleteArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return QueueController;
};
