module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Scene extends app.Service {
    get statusModule() {
      return this.ctx.bean.status.module(moduleInfo.relativeName);
    }

    async list() {
      return this.ctx.bean.mailSceneCache.getMailScenesConfigForAdmin();
    }

    async save({ sceneName, config }) {
      const scenes = this.ctx.bean.mailSceneCache.getMailScenesConfigCache();
      scenes[sceneName] = config;
      // update
      await this.statusModule.set('mailScenes', scenes);
      // changed
      await this.ctx.bean.mailSceneCache.mailSceneChanged();
    }
  }

  return Scene;
};
