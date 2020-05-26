module.exports = app => {
  class MessageClassController extends app.Controller {

    async queueRegister() {
      const res = await this.ctx.service.messageClass.queueRegister({
        module: this.ctx.request.body.module,
        messageClassName: this.ctx.request.body.messageClassName,
      });
      this.ctx.success(res);
    }

    async messageClass() {
      const res = await this.ctx.service.messageClass.messageClass({
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

  }
  return MessageClassController;
};
