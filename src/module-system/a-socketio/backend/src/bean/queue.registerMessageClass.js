module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, messageClassName } = context.data;
      return await this.ctx.bean.io.messageClass.queueRegister({ module, messageClassName });
    }

  }

  return Queue;
};
