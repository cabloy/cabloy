module.exports = app => {
  class icon extends app.Service {
    getIcons() {
      return this.ctx.bean.icon.getIcons();
    }
  }

  return icon;
};
