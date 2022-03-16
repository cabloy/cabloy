module.exports = app => {
  class authSceneController extends app.Controller {
    async disable() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.authScene.disable({
        id: this.ctx.request.body.id,
        sceneName: this.ctx.request.body.sceneName,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }
  }

  return authSceneController;
};
