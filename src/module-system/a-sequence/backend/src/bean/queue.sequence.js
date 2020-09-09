module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, name } = context.data;
      return await this.ctx.bean.sequence.module(module)._next(name);
    }

  }

  return Queue;
};
