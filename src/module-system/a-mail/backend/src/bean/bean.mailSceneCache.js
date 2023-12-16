const __mailScenesConfigCache = {};

const moduleInfo = module.info;
module.exports = class MailSceneCache {
  get configModule() {
    return this.ctx.config.module(moduleInfo.relativeName);
  }
  get statusModule() {
    return this.ctx.bean.status.module(moduleInfo.relativeName);
  }

  getMailScenesConfigCache() {
    return __mailScenesConfigCache[this.ctx.subdomain];
  }

  getMailSceneConfigCache(sceneName) {
    return __mailScenesConfigCache[this.ctx.subdomain][sceneName];
  }

  getMailScenesConfigForAdmin() {
    let scenes = this.getMailScenesConfigCache();
    scenes = this.ctx.bean.util.extend({}, scenes);
    for (const sceneName in scenes) {
      const scene = scenes[sceneName];
      scene.titleLocale = this.ctx.text(scene.title);
    }
    return scenes;
  }

  async mailSceneChanged() {
    // change self
    await this._cacheMailScenesConfig();
    // broadcast
    this.ctx.meta.util.broadcastEmit({
      module: 'a-mail',
      broadcastName: 'mailSceneChanged',
      data: null,
    });
  }

  purgeScene(scene) {
    const res = this.ctx.bean.util.extend({}, scene);
    delete res.titleLocale;
    return res;
  }

  async _cacheMailScenesConfig() {
    // configDefault
    const configDefault = this.configModule.scenes;
    // configScenes
    let configScenes = await this.statusModule.get('mailScenes');
    configScenes = this.ctx.bean.util.extend({}, configDefault, configScenes);
    // cache
    __mailScenesConfigCache[this.ctx.subdomain] = configScenes;
  }
};
