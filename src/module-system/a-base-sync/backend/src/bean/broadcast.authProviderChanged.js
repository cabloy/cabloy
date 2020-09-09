module.exports = app => {
  class Broadcast extends app.meta.BeanBase {

    async execute(context) {
      const data = context.data;
      await this.ctx.bean.auth._registerInstanceProvider(this.ctx.subdomain, this.ctx.instance.id, data.module, data.providerName);
    }

  }

  return Broadcast;
};
