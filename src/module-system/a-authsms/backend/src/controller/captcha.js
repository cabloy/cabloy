module.exports = app => {
  class CaptchaController extends app.Controller {

    async sendCode() {
      await this.ctx.service.captcha.sendCode({
        providerInstanceId: this.ctx.request.body.providerInstanceId,
        context: this.ctx.request.body.context,
      });
      this.ctx.success();
    }

  }
  return CaptchaController;
};
