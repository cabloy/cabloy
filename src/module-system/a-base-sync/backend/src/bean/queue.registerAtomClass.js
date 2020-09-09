module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, atomClassName, atomClassIdParent } = context.data;
      return await ctx.bean.atomClass.register({ module, atomClassName, atomClassIdParent });
    }

  }

  return Queue;
};
