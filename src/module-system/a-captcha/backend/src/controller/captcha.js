module.exports = app => {
  class CaptchaController extends app.Controller {

    async getProvider() {
      const res = await this.service.captcha.getProvider();
      this.ctx.success(res);
    }

  }
  return CaptchaController;
};
