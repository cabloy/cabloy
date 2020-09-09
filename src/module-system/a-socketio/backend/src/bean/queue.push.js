module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { options, message, messageSyncs, messageSync, messageClass } = context.data;
      return await this.ctx.bean.io.queuePush({ options, message, messageSyncs, messageSync, messageClass });
    }

  }

  return Queue;
};
