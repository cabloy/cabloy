module.exports = class Broadcast {
  async execute(context) {
    const sameAsCaller = context.sameAsCaller;
    if (!sameAsCaller) {
      await this.ctx.bean.mailSceneCache._cacheMailScenesConfig();
    }
  }
};
