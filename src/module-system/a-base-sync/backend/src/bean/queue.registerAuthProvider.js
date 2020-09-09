module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, providerName } = context.data;
      return await ctx.bean.user.registerAuthProvider({ module, providerName });
    }

  }

  return Queue;
};
