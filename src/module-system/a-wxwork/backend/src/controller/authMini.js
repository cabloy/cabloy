module.exports = app => {
  class AuthMiniController extends app.Controller {

    async login() {
      const res = await this.service.authMini.login({
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }
  return AuthMiniController;
};
