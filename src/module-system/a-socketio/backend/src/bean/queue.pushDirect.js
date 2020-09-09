module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { options, content, channel } = context.data;
      return await ctx.bean.io.queuePushDirect({ options, content, channel });
    }

  }

  return Queue;
};
