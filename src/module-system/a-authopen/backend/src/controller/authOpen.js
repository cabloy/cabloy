module.exports = app => {
  class AuthOpenController extends app.Controller {
    async hideClientSecret() {
      const res = await this.ctx.service.authOpen.hideClientSecret({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return AuthOpenController;
};
