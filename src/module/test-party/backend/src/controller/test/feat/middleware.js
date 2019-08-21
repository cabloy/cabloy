module.exports = app => {

  class TestController extends app.Controller {

    async interception() {
      const { a, b } = this.ctx.request.body;
      const c = parseInt(a) + parseInt(b);
      this.ctx.success(c);
    }

    async restructuring() {
      const { a, b } = this.ctx.request.body;
      const c = a + b;
      this.ctx.success(c);
    }

    async injection() {
      const { a, b } = this.ctx.request.body;
      const c = this.ctx.meta.__plus(a, b);
      this.ctx.success(c);
    }

  }

  return TestController;
};

