module.exports = class CaptchaController {
  async createProviderInstance() {
    const res = await this.service.captcha.createProviderInstance({
      module: this.ctx.request.body.module,
      sceneName: this.ctx.request.body.sceneName,
      context: this.ctx.request.body.context,
    });
    this.ctx.success(res);
  }

  async refreshProviderInstance() {
    const res = await this.service.captcha.refreshProviderInstance({
      providerInstanceId: this.ctx.request.body.providerInstanceId,
      module: this.ctx.request.body.module,
      sceneName: this.ctx.request.body.sceneName,
      context: this.ctx.request.body.context,
    });
    this.ctx.success(res);
  }
};
