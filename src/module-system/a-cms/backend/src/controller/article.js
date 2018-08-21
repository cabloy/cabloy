module.exports = app => {

  class ArticleController extends app.Controller {

    async create() {
      const res = await this.ctx.service.article.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.article.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.article.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.article.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.article.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.article.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.article.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return ArticleController;
};

