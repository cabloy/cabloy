module.exports = class Middleware {
  async execute(options, next) {
    // check appReady
    if (!this.ctx.innerAccess) {
      await this.ctx.bean.instance.checkAppReady();
    }
    // next
    await next();
  }
};
