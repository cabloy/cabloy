module.exports = class Broadcast {
  async execute() {
    await this.ctx.bean.instance.resetCache({ subdomain: this.ctx.subdomain });
  }
};
