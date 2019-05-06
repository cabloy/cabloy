module.exports = app => {

  class Base extends app.Service {

    modules() {
      return this.ctx.meta.base.modules();
    }

    locales() {
      return this.ctx.meta.base.locales();
    }

    atomClasses() {
      return this.ctx.meta.base.atomClasses();
    }

    actions() {
      return this.ctx.meta.base.actions();
    }

    flags() {
      return this.ctx.meta.base.flags();
    }

    orders() {
      return this.ctx.meta.base.orders();
    }

    menus() {
      return this.ctx.meta.base.menus();
    }

    functions() {
      return this.ctx.meta.base.functions();
    }

  }

  return Base;
};
