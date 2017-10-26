module.exports = app => {
  class HomeController extends app.Controller {

    async index() {
      const message = await this.service.home.index();
      this.ctx.success(message);
    }

  }
  return HomeController;
};
