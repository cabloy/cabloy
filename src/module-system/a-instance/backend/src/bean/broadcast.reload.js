module.exports = class Broadcast {
  async execute() {
    await this.ctx.bean.instance.instanceStartup({
      subdomain: this.ctx.subdomain,
      options: {
        force: true,
        instanceBase: null,
      },
    });
  }
};
