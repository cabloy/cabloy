module.exports = app => {

  class RenderController extends app.Controller {

    async getArticleUrl() {
      const res = await this.ctx.service.render.getArticleUrl(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return RenderController;
};

