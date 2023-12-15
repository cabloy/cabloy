module.exports = class Startup {
  async execute(/* context*/) {
    // cache all mailScenes
    await this.ctx.bean.mailSceneCache._cacheMailScenesConfig();
  }
};
