module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, providerName } = context.data;
      return await this.ctx.bean.user.registerAuthProvider({ module, providerName });
    }

  }

  return Queue;
};
