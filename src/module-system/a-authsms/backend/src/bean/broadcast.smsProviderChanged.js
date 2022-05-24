module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      if (!sameAsCaller) {
        await this.ctx.bean.smsProviderCache._cacheSmsProvidersConfig();
      }
    }
  }

  return Broadcast;
};
