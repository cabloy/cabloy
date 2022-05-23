module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache all mailScenes
      await this.ctx.bean.mailSceneCache._cacheMailScenesConfig();
    }
  }

  return Startup;
};
