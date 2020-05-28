module.exports = app => {
  class MessageController extends app.Controller {

    async offset() {
      const res = await this.ctx.service.message.offset({
        messageClass: this.ctx.request.body.messageClass,
        options: this.ctx.request.body.options,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.message.select({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.message.count({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.success(count);
    }

    async setRead() {
      const res = await this.ctx.service.message.setRead({
        messageIds: this.ctx.request.body.messageIds,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.message.delete({
        messageIds: this.ctx.request.body.messageIds,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return MessageController;
};
