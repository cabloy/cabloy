module.exports = app => {

  class PostController extends app.Controller {

    async create() {
      const res = await this.ctx.service.post.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.post.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.post.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.post.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.post.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.post.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.post.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return PostController;
};

