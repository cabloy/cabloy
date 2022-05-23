module.exports = app => {
  class Scene extends app.Service {
    async list() {
      return this.ctx.bean.mailSceneCache.getMailScenesConfigForAdmin();
    }
  }

  return Scene;
};
