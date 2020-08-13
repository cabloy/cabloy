module.exports = app => {
  class AuthController extends app.Controller {

    async login() {
      const res = await this.service.auth.login({
        scene: this.ctx.request.body.scene,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }
  return AuthController;
};
