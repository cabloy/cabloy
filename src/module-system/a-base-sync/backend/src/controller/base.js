module.exports = app => {

  class BaseController extends app.Controller {

    modules() {
      const res = this.ctx.service.base.modules();
      this.ctx.success(res);
    }

    locales() {
      const res = this.ctx.service.base.locales();
      this.ctx.success(res);
    }

    atomClasses() {
      const res = this.ctx.service.base.atomClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }

    flags() {
      const res = this.ctx.service.base.flags();
      this.ctx.success(res);
    }

    menus() {
      const res = this.ctx.service.base.menus();
      this.ctx.success(res);
    }

    functions() {
      const res = this.ctx.service.base.functions();
      this.ctx.success(res);
    }

  }

  return BaseController;
};
