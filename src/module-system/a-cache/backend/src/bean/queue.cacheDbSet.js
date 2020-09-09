module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, name, value, timeout } = context.data;
      return await ctx.cache._db.module(module)._set({ name, value, timeout, queue: false });
    }

  }

  return Queue;
};
