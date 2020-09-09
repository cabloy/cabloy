module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, name } = context.data;
      return await this.ctx.bean.function.register({ module, name });
    }

  }

  return Queue;
};
