module.exports = app => {
  class iconController extends app.Controller {
    getIcons() {
      const res = this.ctx.service.icon.getIcons();
      this.ctx.success(res);
    }
  }

  return iconController;
};
