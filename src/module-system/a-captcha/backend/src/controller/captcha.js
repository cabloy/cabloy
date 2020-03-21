module.exports = app => {
  class CaptchaController extends app.Controller {

    async createProviderInstance() {
      const res = await this.service.captcha.createProviderInstance({
        module: this.ctx.request.body.module,
        sceneName: this.ctx.request.body.sceneName,
        context: this.ctx.request.body.context,
      });
      this.ctx.success(res);
    }

  }
  return CaptchaController;
};
