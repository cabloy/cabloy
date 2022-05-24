const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Scene extends app.Service {
    get statusModule() {
      return this.ctx.bean.status.module(moduleInfo.relativeName);
    }

    async list() {
      return this.ctx.bean.mailSceneCache.getMailScenesConfigForAdmin();
    }

    async save({ sceneName, data }) {
      const scenes = this.ctx.bean.mailSceneCache.getMailScenesConfigCache();
      scenes[sceneName] = data ? this.ctx.bean.mailSceneCache.purgeScene(data) : data;
      // update
      await this.statusModule.set('mailScenes', scenes);
      // changed
      await this.ctx.bean.mailSceneCache.mailSceneChanged();
    }

    async delete({ sceneName }) {
      await this.save({ sceneName, data: undefined });
    }

    async add({ sceneName, data }) {
      data = extend(true, {}, this.ctx.config.scene.default, data);
      await this.save({ sceneName, data });
    }
  }

  return Scene;
};
