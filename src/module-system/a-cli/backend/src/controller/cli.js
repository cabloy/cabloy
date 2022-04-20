module.exports = app => {
  class cliController extends app.Controller {
    async meta() {
      const res = await this.ctx.service.cli.meta();
      this.ctx.success(res);
    }
  }

  return cliController;
};
