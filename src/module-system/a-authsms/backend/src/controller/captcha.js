module.exports = app => {
  class CaptchaController extends app.Controller {

    async sendCode() {
      await this.ctx.service.captcha.sendCode({
        providerInstanceId: this.ctx.request.body.providerInstanceId,
        context: this.ctx.request.body.context,
      });
      this.ctx.success();
    }

    async verify() {
      const { providerInstanceId, context, data, dataInput } = this.ctx.request.body;
      await this.ctx.service.captcha.verify({ providerInstanceId, context, data, dataInput });
      this.ctx.success();
    }

  }
  return CaptchaController;
};
