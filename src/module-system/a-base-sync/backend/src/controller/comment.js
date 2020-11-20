module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      const options = this.ctx.request.body.options;
      options.comment = 1;
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'atom/select',
        body: {
          atomClass: this.ctx.request.body.atomClass,
          options,
        },
      });
      this.ctx.success(res);
    }

    async list() {
      const key = this.ctx.request.body.key;
      const options = this.ctx.request.body.options;
      const user = this.ctx.state.user.op;
      options.page = this.ctx.bean.util.page(options.page);
      // checkRightRead
      const res = await this.ctx.bean.atom.checkRightRead({
        atom: { id: key.atomId },
        user,
        checkFlow: true,
      });
      if (!res) this.ctx.throw(403);
      const items = await this.ctx.service.comment.list({
        key,
        options,
        user,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async item() {
      const res = await this.ctx.service.comment.item({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async save() {
      const res = await this.ctx.service.comment.save({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.comment.delete({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async heart() {
      const res = await this.ctx.service.comment.heart({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};
