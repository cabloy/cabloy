module.exports = app => {
  class authSceneController extends app.Controller {
    async action() {
      const res = await this.ctx.service.authScene.action();
      this.ctx.success(res);
    }
  }

  return authSceneController;
};
