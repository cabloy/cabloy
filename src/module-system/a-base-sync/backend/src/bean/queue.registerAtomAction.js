module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { atomClassId, code } = context.data;
      return await ctx.bean.atomAction.register({ atomClassId, code });
    }

  }

  return Queue;
};
