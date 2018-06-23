module.exports = app => {

  class UserController extends app.Controller {

    async getLabels() {
      const res = await this.ctx.service.user.getLabels({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async setLabels() {
      await this.ctx.service.user.setLabels({
        labels: this.ctx.request.body.labels,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

  }
  return UserController;
};

