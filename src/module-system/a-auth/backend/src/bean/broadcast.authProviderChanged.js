module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const data = context.data;
      if (!sameAsCaller) {
        await this.ctx.bean.authProvider._cacheAuthProviderConfig(data.module, data.providerName);
      }
    }
  }

  return Broadcast;
};
