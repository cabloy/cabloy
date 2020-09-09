module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, name, value, timeout } = context.data;
      return await this.ctx.cache._db.module(module)._set({ name, value, timeout, queue: false });
    }

  }

  return Queue;
};
