module.exports = app => {
  class Flow extends app.Service {
    async select({ options, user }) {
      return await this.ctx.bean.flow.select({ options, user });
    }

    async count({ options, user }) {
      return await this.ctx.bean.flow.count({ options, user });
    }
  }
  return Flow;
};
