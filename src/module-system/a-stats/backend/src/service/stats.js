module.exports = app => {

  class Stats extends app.Service {

    async get({ module, name, nameSub, user }) {
      return await this.ctx.bean.stats.get({ module, name, nameSub, user });
    }
  }

  return Stats;
};
