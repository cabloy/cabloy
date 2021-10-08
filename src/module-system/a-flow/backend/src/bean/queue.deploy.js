module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const { flowDefId, undeploy } = context.data;
      await this.ctx.bean.flowDef._deployQueue({ flowDefId, undeploy });
    }
  }

  return Queue;
};
