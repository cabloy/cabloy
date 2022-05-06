module.exports = app => {
  class Base extends app.Service {
    detailClasses() {
      return this.ctx.bean.detailClass.detailClasses();
    }

    actions() {
      return this.ctx.bean.detailAction.actions();
    }
  }

  return Base;
};
