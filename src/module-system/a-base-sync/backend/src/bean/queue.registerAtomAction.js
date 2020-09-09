module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { atomClassId, code } = context.data;
      return await this.ctx.bean.atomAction.register({ atomClassId, code });
    }

  }

  return Queue;
};
