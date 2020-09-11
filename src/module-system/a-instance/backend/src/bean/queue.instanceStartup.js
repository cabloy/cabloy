module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { subdomain, options } = context.data;
      return await this.ctx.bean.instance._instanceStartupQueue({ subdomain, options });
    }

  }

  return Queue;
};
