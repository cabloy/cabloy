module.exports = class Middleware {
  async execute(options, next) {
    // init instance
    await this.ctx.bean.instance.initInstance();
    // next
    await next();
  }
};
