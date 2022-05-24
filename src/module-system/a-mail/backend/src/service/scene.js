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

    async save({ sceneName, config }) {
      const scenes = this.ctx.bean.mailSceneCache.getMailScenesConfigCache();
      scenes[sceneName] = config ? this.ctx.bean.mailSceneCache.purgeScene(config) : config;
      // update
      await this.statusModule.set('mailScenes', scenes);
      // changed
      await this.ctx.bean.mailSceneCache.mailSceneChanged();
    }

    async delete({ sceneName }) {
      await this.save({ sceneName, config: undefined });
    }

    async add({ sceneName, config }) {
      config = extend(true, {}, this.ctx.config.scene.default, config);
      await this.save({ sceneName, config });
    }
  }

  return Scene;
};
