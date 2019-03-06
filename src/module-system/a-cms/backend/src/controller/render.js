module.exports = app => {

  class RenderController extends app.Controller {

    async getArticleUrl() {
      const res = await this.ctx.service.render.getArticleUrl({
        atomClass: this.ctx.request.body.atomClass,
        key: this.ctx.request.body.key,
      });
      this.ctx.success(res);
    }

  }
  return RenderController;
};

