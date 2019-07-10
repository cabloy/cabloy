module.exports = app => {

  class SendMailController extends app.Controller {

    async sendMail() {
      // send
      await this.ctx.meta.mail.send({
        scene: 'test',
        message: {
          to: 'test@cabloy.com',
          subject: 'this is a test',
          text: 'message body!',
        },
      });
      // done
      this.ctx.success();
    }

  }

  return SendMailController;

};
