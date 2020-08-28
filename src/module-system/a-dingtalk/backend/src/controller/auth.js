module.exports = app => {
  class AuthController extends app.Controller {

    async login() {
      const res = await this.service.auth.login({
        scene: this.ctx.request.body.scene,
        code: this.ctx.request.body.code,
        state: this.ctx.request.body.state,
      });
      this.ctx.success(res);
    }

    async loginMini() {
      const res = await this.service.auth.login({
        scene: `dingtalkmini${this.ctx.request.body.scene}`,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }
  return AuthController;
};
