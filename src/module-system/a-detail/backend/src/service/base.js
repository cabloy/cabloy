module.exports = app => {
  class Base extends app.Service {
    actions() {
      return this.ctx.bean.detailAction.actions();
    }
  }

  return Base;
};
