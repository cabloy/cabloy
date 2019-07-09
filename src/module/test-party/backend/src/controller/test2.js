const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class Test2Controller extends app.Controller {

    // sendMail
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
      // ok
      this.ctx.success();
    }

  }

  return Test2Controller;

};
