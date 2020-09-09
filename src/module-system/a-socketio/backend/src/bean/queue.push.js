module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { options, message, messageSyncs, messageSync, messageClass } = context.data;
      return await ctx.bean.io.queuePush({ options, message, messageSyncs, messageSync, messageClass });
    }

  }

  return Queue;
};
