module.exports = class Broadcast {
  async execute(context) {
    const sameAsCaller = context.sameAsCaller;
    const data = context.data;
    if (!sameAsCaller) {
      await this.ctx.bean.authProviderCache._cacheAuthProviderConfig(data.module, data.providerName);
    }
  }
};
