module.exports = app => {
  class MessageClassController extends app.Controller {

    async messageClass() {
      const res = await this.ctx.service.messageClass.messageClass({
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

  }
  return MessageClassController;
};
