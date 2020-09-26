module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { flowDefId } = context.data;
      await this.ctx.bean.flowDef._deployQueue({ flowDefId });
    }

  }

  return Queue;
};
