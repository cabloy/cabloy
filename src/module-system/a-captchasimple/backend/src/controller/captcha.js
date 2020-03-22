const require3 = require('require3');
const captcha = require3('trek-captcha');

module.exports = app => {
  class CaptchaController extends app.Controller {

    async image() {
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

    async verify() {
      // const { providerInstanceId, context } = this.ctx.request.body;
      const { data, dataInput } = this.ctx.request.body;
      if (!data) this.ctx.throw(1001);
      if (data.token !== dataInput.token) this.ctx.throw(1002);
      this.ctx.success();
    }

  }
  return CaptchaController;
};
