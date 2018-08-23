module.exports = app => {

  class RenderController extends app.Controller {

    async article() {
      const res = await this.ctx.service.render.renderArticle(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return RenderController;
};

