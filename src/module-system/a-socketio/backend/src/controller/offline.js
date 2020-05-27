module.exports = app => {
  class OfflineController extends app.Controller {

    async offset() {
      const res = await this.ctx.service.offline.offset({
        messageClass: this.ctx.request.body.messageClass,
        options: this.ctx.request.body.options,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async fetch() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.offline.fetch({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.offline.count({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.success(count);
    }

  }
  return OfflineController;
};
