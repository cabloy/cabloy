module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, name, value } = context.data;
      return await this.ctx.bean.status.module(module)._set({ name, value, queue: false });
    }

  }

  return Queue;
};
