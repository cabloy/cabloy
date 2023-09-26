const captcha = require('trek-captcha');

module.exports = app => {
  class CaptchaController extends app.Controller {
    async image() {
      // providerInstanceId
      const providerInstanceId = this.ctx.query.providerInstanceId;
      // create
      const { token, buffer } = await captcha();
      // update
      await this.ctx.bean.captcha.update({
        providerInstanceId,
        data: { token },
      });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/gif';
      this.ctx.body = buffer;
    }
  }
  return CaptchaController;
};
