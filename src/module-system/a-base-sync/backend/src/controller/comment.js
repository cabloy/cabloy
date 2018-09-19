module.exports = app => {

  class CommentController extends app.Controller {

    async list() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.comment.list({
        key: this.ctx.request.body.key,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async save() {
      const res = await this.ctx.service.comment.save({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.comment.delete({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async item() {
      const res = await this.ctx.service.comment.item({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};
