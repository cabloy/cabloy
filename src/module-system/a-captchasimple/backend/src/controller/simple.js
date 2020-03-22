const require3 = require('require3');
const captcha = require3('trek-captcha');

module.exports = app => {
  class SimpleController extends app.Controller {

    async getCaptcha() {
      // providerInstanceId
      const providerInstanceId = this.ctx.query.providerInstanceId;
      // create
      const { token, buffer } = await captcha();
      // update
      await this.ctx.meta.captcha.update({
        providerInstanceId, data: { token },
      });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/gif';
      this.ctx.body = buffer;
    }

  }
  return SimpleController;
};
