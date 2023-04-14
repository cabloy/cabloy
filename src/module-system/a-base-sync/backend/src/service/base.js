module.exports = app => {
  class Base extends app.Service {
    modules() {
      return this.ctx.bean.base.modules();
    }

    locales() {
      return this.ctx.bean.base.locales();
    }

    resourceTypes() {
      return this.ctx.bean.base.resourceTypes();
    }

    getAtomClassBase({ atomClass }) {
      return this.ctx.bean.base.atomClass({ module: atomClass.module, atomClassName: atomClass.atomClassName });
    }

    atomClasses() {
      return this.ctx.bean.base.atomClasses();
    }

    actions() {
      return this.ctx.bean.base.actions();
    }

    themes() {
      return this.ctx.bean.base.themes();
    }
  }

  return Base;
};
