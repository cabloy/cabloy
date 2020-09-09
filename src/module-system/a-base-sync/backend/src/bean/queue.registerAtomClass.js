module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, atomClassName, atomClassIdParent } = context.data;
      return await this.ctx.bean.atomClass.register({ module, atomClassName, atomClassIdParent });
    }

  }

  return Queue;
};
