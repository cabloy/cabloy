module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, name, value } = context.data;
      return await ctx.bean.status.module(module)._set({ name, value, queue: false });
    }

  }

  return Queue;
};
