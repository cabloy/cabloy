module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { path, options, message, messageSyncs, messageClass } = context.data;
      return await ctx.bean.io.queueDelivery({ path, options, message, messageSyncs, messageClass });
    }

  }

  return Queue;
};
