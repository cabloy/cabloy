module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { options, content, channel } = context.data;
      return await this.ctx.bean.io.queuePushDirect({ options, content, channel });
    }

  }

  return Queue;
};
