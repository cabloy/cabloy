module.exports = app => {
  class cliController extends app.Controller {
    async meta() {
      const res = await this.ctx.service.cli.meta({
        argv: this.ctx.request.body.argv,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return cliController;
};
