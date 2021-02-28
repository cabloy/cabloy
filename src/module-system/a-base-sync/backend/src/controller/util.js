module.exports = app => {

  class UtilController extends app.Controller {

    async performAction() {
      const res = await this.ctx.service.util.performAction({
        params: JSON.parse(this.ctx.request.query.params),
      });
      this.ctx.success(res);
    }

    async performActions() {
      const res = await this.ctx.service.util.performActions({
        actions: this.ctx.request.body.actions,
      });
      this.ctx.success(res);
    }

  }
  return UtilController;
};

