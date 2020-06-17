module.exports = app => {
  class TestController extends app.Controller {

    async getMemberId() {
      const res = await this.service.test.getMemberId({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return TestController;
};
