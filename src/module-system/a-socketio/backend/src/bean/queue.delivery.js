module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { path, options, message, messageSyncs, messageClass } = context.data;
      return await this.ctx.bean.io.queueDelivery({ path, options, message, messageSyncs, messageClass });
    }

  }

  return Queue;
};
