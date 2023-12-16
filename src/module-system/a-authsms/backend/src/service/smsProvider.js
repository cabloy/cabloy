const moduleInfo = module.info;
module.exports = class SmsProvider {
  get statusModule() {
    return this.ctx.bean.status.module(moduleInfo.relativeName);
  }

  async list() {
    return this.ctx.bean.smsProviderCache.getSmsProvidersConfigForAdmin();
  }

  async setCurrent({ providerName }) {
    const providers = this.ctx.bean.smsProviderCache.getSmsProvidersConfigCache();
    const providerNameOld = Object.keys(providers).find(providerName => providers[providerName].current);
    if (providerNameOld) {
      providers[providerNameOld].current = false;
    }
    providers[providerName].current = true;
    // update
    await this.statusModule.set('smsProviders', providers);
    // changed
    await this.ctx.bean.smsProviderCache.smsProviderChanged();
  }

  async save({ providerName, data }) {
    const providers = this.ctx.bean.smsProviderCache.getSmsProvidersConfigCache();
    const providerOld = providers[providerName];
    data = this.ctx.bean.util.extend({}, providerOld, data);
    await this._save({ providerName, data });
  }

  async _save({ providerName, data }) {
    const providers = this.ctx.bean.smsProviderCache.getSmsProvidersConfigCache();
    providers[providerName] = data ? this.ctx.bean.smsProviderCache.purgeProvider(data) : data;
    // update
    await this.statusModule.set('smsProviders', providers);
    // changed
    await this.ctx.bean.smsProviderCache.smsProviderChanged();
  }
};
