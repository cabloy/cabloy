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

    panels() {
      return this.ctx.meta.base.panels();
    }

    widgets() {
      return this.ctx.meta.base.widgets();
    }

    sections() {
      return this.ctx.meta.base.sections();
    }

    buttons() {
      return this.ctx.meta.base.buttons();
    }

    functions() {
      return this.ctx.meta.base.functions();
    }

    themes() {
      return this.ctx.meta.base.themes();
    }

  }

  return Base;
};
