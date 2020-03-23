module.exports = app => {
  class AuthController extends app.Controller {

    async signin() {
      const { mobile, rememberMe } = this.ctx.request.body.data;
      const res = await this.service.auth.signin({ mobile, rememberMe });
      this.ctx.success(res);
    }

  }
  return AuthController;
};
