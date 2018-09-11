module.exports = app => {

  class RenderController extends app.Controller {

    async renderArticle() {
      const res = await this.ctx.service.render.renderArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

    async deleteArticle() {
      const res = await this.ctx.service.render.deleteArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

    async getArticleUrl() {
      const res = await this.ctx.service.render.getArticleUrl(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return RenderController;
};

