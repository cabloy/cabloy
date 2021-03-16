module.exports = app => {

  class BaseController extends app.Controller {

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }

  }

  return BaseController;
};
