module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, name } = context.data;
      return await ctx.bean.sequence.module(module)._next(name);
    }

  }

  return Queue;
};
