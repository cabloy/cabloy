module.exports = app => {
  class DictController extends app.Controller {
    async action() {
      const res = await this.ctx.service.demo.action();
      this.ctx.success(res);
    }
  }

  return DictController;
};
