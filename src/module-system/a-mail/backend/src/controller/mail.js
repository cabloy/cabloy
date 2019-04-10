module.exports = app => {

  class MailController extends app.Controller {

    async queueSend() {
      await this.service.mail.queueSend();
      this.ctx.success();
    }

    async schedulePushQueueInstance() {
      await this.service.mail.schedulePushQueueInstance();
      this.ctx.success();
    }

  }
  return MailController;
};

