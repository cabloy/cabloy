module.exports = app => {
  class BaseController extends app.Controller {
    detailClasses() {
      const res = this.ctx.service.base.detailClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }
  }

  return BaseController;
};
