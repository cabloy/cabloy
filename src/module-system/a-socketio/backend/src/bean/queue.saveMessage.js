module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { path, options, message, messageClass } = context.data;
      return await this.ctx.bean.io.queueSaveMessage({ path, options, message, messageClass });
    }

  }

  return Queue;
};
