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
      // const { providerInstanceId, context } = this.ctx.request.body;
      const { data, dataInput } = this.ctx.request.body;
      if (!data) this.ctx.throw(1001);
      if (data.token !== dataInput.token) this.ctx.throw(1002);
      this.ctx.success();
    }

  }
  return CaptchaController;
};
