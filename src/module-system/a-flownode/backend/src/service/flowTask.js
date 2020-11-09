module.exports = app => {

  class FlowTask extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.flowTask.select({ options, user });
    }

    async count({ options, user }) {
      return await this.ctx.bean.flowTask.count({ options, user });
    }

  }
  return FlowTask;
};

