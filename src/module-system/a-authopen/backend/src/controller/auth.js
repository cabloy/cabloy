module.exports = app => {
  class AuthController extends app.Controller {
    async signin() {
      const res = await this.ctx.service.auth.signin({
        clientID: this.ctx.request.body.clientID,
        clientSecret: this.ctx.request.body.clientSecret,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};
