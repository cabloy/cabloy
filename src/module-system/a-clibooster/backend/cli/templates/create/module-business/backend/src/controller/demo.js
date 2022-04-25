module.exports = app => {
  class DemoController extends app.Controller {
    async action() {
      const res = await this.ctx.service.demo.action();
      this.ctx.success(res);
    }
  }

  return DemoController;
};
