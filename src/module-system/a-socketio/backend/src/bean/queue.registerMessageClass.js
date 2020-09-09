module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, messageClassName } = context.data;
      return await ctx.bean.io.messageClass.queueRegister({ module, messageClassName });
    }

  }

  return Queue;
};
