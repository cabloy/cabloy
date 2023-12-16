module.exports = class Flow {
  async select({ options, user }) {
    return await this.ctx.bean.flow.select({ options, user });
  }

  async count({ options, user }) {
    return await this.ctx.bean.flow.count({ options, user });
  }
};
