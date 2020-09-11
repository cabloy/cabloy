module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const instanceBase = context.data;
      return await this.ctx.bean.instance._registerQueue(instanceBase);
    }

  }

  return Queue;
};
