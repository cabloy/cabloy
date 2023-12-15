module.exports = class Startup {
  async execute(context) {
    const options = context.options;
    const beanVersion = this.ctx.bean.local.version;
    return await beanVersion.instanceInitStartup({ options });
  }
};
