module.exports = app => {
  class SceneController extends app.Controller {
    async list() {
      const res = await this.ctx.service.scene.list({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return SceneController;
};
