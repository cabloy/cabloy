module.exports = app => {
  class cliController extends app.Controller {
    async meta() {
      const res = await this.ctx.service.cli.meta({
        context: this.ctx.request.body.context,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async execute() {
      const res = await this.ctx.service.cli.execute({
        progressId: this.ctx.request.body.progressId,
        context: this.ctx.request.body.context,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return cliController;
};
