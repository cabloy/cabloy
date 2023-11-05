module.exports = app => {
  class DemoController extends app.Controller {
    async demo() {
      const method = this.ctx.params.method;
      console.log(method);
      this.ctx.success(method);
    }
  }

  return DemoController;
};
