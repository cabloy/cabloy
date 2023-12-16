module.exports = class Stats {
  async get({ module, name, nameSub, user }) {
    return await this.ctx.bean.stats.get({ module, name, nameSub, user });
  }
};
