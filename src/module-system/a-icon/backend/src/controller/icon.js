module.exports = app => {
  class iconController extends app.Controller {
    async getIcons() {
      const res = await this.ctx.service.icon.getIcons();
      this.ctx.success(res);
    }
  }

  return iconController;
};
