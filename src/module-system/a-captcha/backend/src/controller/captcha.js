module.exports = app => {
  class CaptchaController extends app.Controller {

    async getProvider() {
      const res = await this.service.captcha.getProvider({
        user: this.ctx.user.agent,
      });
      this.ctx.success(res);
    }

  }
  return CaptchaController;
};
