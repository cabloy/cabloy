module.exports = class Startup {
  async execute(/* context*/) {
    // register routers
    await this.ctx.bean.authProvider._registerRouters();
  }
};
