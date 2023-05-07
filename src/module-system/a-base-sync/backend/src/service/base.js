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

    async getAtomClassBase({ atomClass }) {
      const atomClassBase = this.ctx.bean.base.atomClass({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      });
      const _atomClass = await this.ctx.bean.atomClass.get(atomClass);
      return {
        id: _atomClass.id,
        ...atomClassBase,
      };
    }

    getActionsBase({ atomClass }) {
      return this.ctx.bean.base.actionsBase({ module: atomClass.module, atomClassName: atomClass.atomClassName });
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
