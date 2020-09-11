module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { options } = context.data;
      await this.ctx.bean.role._buildQueue(options);
    }

  }

  return Queue;
};
