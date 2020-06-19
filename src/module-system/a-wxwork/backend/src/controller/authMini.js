module.exports = app => {
  class AuthMiniController extends app.Controller {

    async login() {
      const res = await this.service.authMini.login({
        scene: this.ctx.request.body.scene,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }
  return AuthMiniController;
};
