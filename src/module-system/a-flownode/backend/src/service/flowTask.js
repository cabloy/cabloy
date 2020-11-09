module.exports = app => {

  class FlowTask extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.flowTask.select({ options, user });
    }

  }
  return FlowTask;
};

