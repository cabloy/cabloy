module.exports = app => {
  class Flow extends app.Service {
    async data({ flowId, user }) {
      return await this.ctx.bean.flowTask.flowData({ flowId, user });
    }
  }
  return Flow;
};
