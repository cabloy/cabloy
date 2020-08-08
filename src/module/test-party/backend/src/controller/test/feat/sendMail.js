module.exports = app => {

  class SendMailController extends app.Controller {

    async sendMail() {
      // send
      const message = this.ctx.request.body.data;
      await this.ctx.meta.mail.send({
        scene: 'test',
        message,
      });
      // done
      this.ctx.success();
    }

  }

  return SendMailController;

};
