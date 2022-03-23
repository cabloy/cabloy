module.exports = app => {
  class AuthController extends app.Controller {
    async login() {
      const res = await this.service.auth.login({
        providerName: 'dingtalk',
        providerScene: this.ctx.request.body.providerScene,
        code: this.ctx.request.body.code,
        state: this.ctx.request.body.state,
      });
      this.ctx.success(res);
    }

    async loginMini() {
      const res = await this.service.auth.login({
        providerName: 'dingtalkmini',
        providerScene: this.ctx.request.body.providerScene,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};
