module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const data = context.data;
      return await this.ctx.bean.stats._notify_queue(data);
    }
  }

  return Queue;
};
