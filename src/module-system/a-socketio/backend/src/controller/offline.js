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

  }
  return OfflineController;
};
