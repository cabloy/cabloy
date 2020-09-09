module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, name } = context.data;
      return await ctx.bean.function.register({ module, name });
    }

  }

  return Queue;
};
