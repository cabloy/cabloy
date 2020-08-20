module.exports = app => {

  class JwtController extends app.Controller {

    async create() {
      const res = await this.ctx.service.jwt.create();
      this.ctx.success(res);
    }

  }
  return JwtController;
};

