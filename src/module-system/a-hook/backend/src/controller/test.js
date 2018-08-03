module.exports = app => {
  class TestController extends app.Controller {

    async test() {
      this.ctx.success();
    }

    async hookTestBefore() {
      console.log('hook:before', this.ctx.ctxCaller.route);
      this.ctx.success();
    }
    async hookTestAfter() {
      console.log('hook:after', this.ctx.ctxCaller.route);
      this.ctx.success();
    }

  }
  return TestController;
};

