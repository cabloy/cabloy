module.exports = app => {
  class TestController extends app.Controller {

    async getMemberId() {
      const res = await this.service.test.getMemberId({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async sendAppMessage() {
      const res = await this.service.test.sendAppMessage({
        message: this.ctx.request.body.message,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return TestController;
};
