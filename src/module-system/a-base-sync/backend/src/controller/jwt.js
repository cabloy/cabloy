module.exports = app => {

  class JwtController extends app.Controller {

    async create() {
      const res = await this.ctx.service.jwt.create({
        scene: this.ctx.request.body.scene,
      });
      this.ctx.success(res);
    }

  }
  return JwtController;
};

