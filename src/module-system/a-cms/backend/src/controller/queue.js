const Build = require('../common/build.js');

module.exports = app => {

  class QueueController extends app.Controller {

    async render() {
      const queueAction = this.ctx.request.body.queueAction;
      await this[queueAction]();
    }

    async buildLanguage() {
      const atomClass = this.ctx.request.body.atomClass;
      const language = this.ctx.request.body.language;
      const progressId = this.ctx.request.body.progressId;

      const build = Build.create(this.ctx, atomClass);
      const res = await build.buildLanguage({ language, progressId });
      this.ctx.success(res);
    }

    async buildLanguages() {
      const atomClass = this.ctx.request.body.atomClass;
      const progressId = this.ctx.request.body.progressId;

      const build = Build.create(this.ctx, atomClass);
      const res = await build.buildLanguages({ progressId });
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
