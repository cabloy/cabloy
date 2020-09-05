module.exports = app => {

  class Base extends app.Service {

    modules() {
      return this.ctx.bean.base.modules();
    }

    locales() {
      return this.ctx.bean.base.locales();
    }

    atomClasses() {
      return this.ctx.bean.base.atomClasses();
    }

    actions() {
      return this.ctx.bean.base.actions();
    }

    flags() {
      return this.ctx.bean.base.flags();
    }

    orders() {
      return this.ctx.bean.base.orders();
    }

    menus() {
      return this.ctx.bean.base.menus();
    }

    panels() {
      return this.ctx.bean.base.panels();
    }

    widgets() {
      return this.ctx.bean.base.widgets();
    }

    sections() {
      return this.ctx.bean.base.sections();
    }

    buttons() {
      return this.ctx.bean.base.buttons();
    }

    functions() {
      return this.ctx.bean.base.functions();
    }

    themes() {
      return this.ctx.bean.base.themes();
    }

  }

  return Base;
};
