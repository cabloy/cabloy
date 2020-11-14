module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const data = context.data;
      const user = this.ctx.state.user.op;
      await this.ctx.bean.flowTask._checkIfNodeDone({ flowNodeId: data.flowNodeId, user });
    }

  }

  return Queue;
};
