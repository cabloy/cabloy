module.exports = app => {
  class AuthController extends app.Controller {

    async list() {
      const res = await this.service.auth.list();
      this.ctx.success(res);
    }

  }
  return AuthController;
};
