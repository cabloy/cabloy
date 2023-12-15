module.exports = class Startup {
  async execute() {
    const beanVersion = this.ctx.bean.local.version;
    return await beanVersion.databaseNameStartup();
  }
};
