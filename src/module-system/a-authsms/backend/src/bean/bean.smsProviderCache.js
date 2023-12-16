const __smsProvidersConfigCache = {};

const moduleInfo = module.info;
module.exports = class SmsProviderCache {
  get configModule() {
    return this.ctx.config.module(moduleInfo.relativeName);
  }
  get statusModule() {
    return this.ctx.bean.status.module(moduleInfo.relativeName);
  }

  getSmsProvidersConfigCache() {
    return __smsProvidersConfigCache[this.ctx.subdomain];
  }

  getSmsProviderConfigCache(providerName) {
    return __smsProvidersConfigCache[this.ctx.subdomain][providerName];
  }

  getSmsProvidersConfigForAdmin() {
    let providers = this.getSmsProvidersConfigCache();
    providers = this.ctx.bean.util.extend({}, providers);
    for (const providerName in providers) {
      const provider = providers[providerName];
      provider.titleLocale = this.ctx.text(provider.title);
    }
    return providers;
  }

  async smsProviderChanged() {
    // change self
    await this._cacheSmsProvidersConfig();
    // broadcast
    this.ctx.meta.util.broadcastEmit({
      module: 'a-mail',
      broadcastName: 'smsProviderChanged',
      data: null,
    });
  }

  purgeProvider(provider) {
    const res = this.ctx.bean.util.extend({}, provider);
    delete res.titleLocale;
    return res;
  }

  async _cacheSmsProvidersConfig() {
    // configDefault
    const configDefault = this.configModule.sms.providers;
    // configProviders
    let configProviders = await this.statusModule.get('smsProviders');
    configProviders = this.ctx.bean.util.extend({}, configDefault, configProviders);
    // cache
    __smsProvidersConfigCache[this.ctx.subdomain] = configProviders;
  }
};
