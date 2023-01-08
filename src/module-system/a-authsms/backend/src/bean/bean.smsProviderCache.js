const __smsProvidersConfigCache = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SmsProviderCache {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get statusModule() {
      return ctx.bean.status.module(moduleInfo.relativeName);
    }

    getSmsProvidersConfigCache() {
      return __smsProvidersConfigCache[ctx.subdomain];
    }

    getSmsProviderConfigCache(providerName) {
      return __smsProvidersConfigCache[ctx.subdomain][providerName];
    }

    getSmsProvidersConfigForAdmin() {
      let providers = this.getSmsProvidersConfigCache();
      providers = ctx.bean.util.extend({}, providers);
      for (const providerName in providers) {
        const provider = providers[providerName];
        provider.titleLocale = ctx.text(provider.title);
      }
      return providers;
    }

    async smsProviderChanged() {
      // change self
      await this._cacheSmsProvidersConfig();
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-mail',
        broadcastName: 'smsProviderChanged',
        data: null,
      });
    }

    purgeProvider(provider) {
      const res = ctx.bean.util.extend({}, provider);
      delete res.titleLocale;
      return res;
    }

    async _cacheSmsProvidersConfig() {
      // configDefault
      const configDefault = this.configModule.sms.providers;
      // configProviders
      let configProviders = await this.statusModule.get('smsProviders');
      configProviders = ctx.bean.util.extend({}, configDefault, configProviders);
      // cache
      __smsProvidersConfigCache[ctx.subdomain] = configProviders;
    }
  }
  return SmsProviderCache;
};
