module.exports = app => {

  class QueueController extends app.Controller {

    async render() {
      const queueAction = this.ctx.request.body.queueAction;
      await this[queueAction]();
    }

    async buildLanguage() {
      const res = await this.ctx.service.site.buildLanguage({
        atomClass: this.ctx.request.body.atomClass,
        language: this.ctx.request.body.language,
        progressId: this.ctx.request.body.progressId,
      });
      this.ctx.success(res);
    }

    async buildLanguages() {
      const res = await this.ctx.service.site.buildLanguages({
        atomClass: this.ctx.request.body.atomClass,
        progressId: this.ctx.request.body.progressId,
      });
      this.ctx.success(res);
    }

    async renderArticle() {
      const res = await this.ctx.service.render.renderArticle({
        atomClass: this.ctx.request.body.atomClass,
        key: this.ctx.request.body.key,
        inner: this.ctx.request.body.inner,
      });
      this.ctx.success(res);
    }

    async deleteArticle() {
      const res = await this.ctx.service.render.deleteArticle({
        atomClass: this.ctx.request.body.atomClass,
        key: this.ctx.request.body.key,
        article: this.ctx.request.body.article,
        inner: this.ctx.request.body.inner,
      });
      this.ctx.success(res);
    }

  }

  return QueueController;
};
