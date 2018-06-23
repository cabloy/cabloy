module.exports = app => {
  class TestController extends app.Controller {

    async validate1() {
      this.ctx.success();
    }

    async validate2() {
      this.ctx.success();
    }

  }
  return TestController;
};

