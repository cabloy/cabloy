module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const options = context.data;
      return await this.ctx.bean.instance._instanceStartupQueue(options);
    }

  }

  return Queue;
};
