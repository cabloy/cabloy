const __authProvidersConfigCache = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AuthProviderCache {
    async _cacheAuthProvidersConfig() {
      if (!__authProvidersConfigCache[ctx.subdomain]) {
        __authProvidersConfigCache[ctx.subdomain] = {};
      }
      const authProviders = ctx.bean.base.authProviders();
      for (const key in authProviders) {
        const [module, providerName] = key.split(':');
        await this._cacheAuthProviderConfig(module, providerName);
      }
    }

    async _cacheAuthProviderConfig(module, providerName) {
      if (!__authProvidersConfigCache[ctx.subdomain]) {
        __authProvidersConfigCache[ctx.subdomain] = {};
      }
      // bean
      const providerFullName = `${module}:${providerName}`;
      const beanProvider = this.createAuthProviderBean({
        module,
        providerName,
        providerScene: null,
      });

      __authProvidersConfigCache[ctx.subdomain][providerFullName] = await beanProvider.loadConfigProvider();
    }

    _getAuthProvidersConfigCache() {
      return __authProvidersConfigCache[ctx.subdomain];
    }

    _getAuthProviderConfigCache(module, providerName) {
      const providerFullName = `${module}:${providerName}`;
      return __authProvidersConfigCache[ctx.subdomain][providerFullName];
    }

    async authProviderChanged(moduleRelativeName, providerName) {
      // change self
      await this._cacheAuthProviderConfig(moduleRelativeName, providerName);
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-auth',
        broadcastName: 'authProviderChanged',
        data: { module: moduleRelativeName, providerName },
      });
    }
  }
  return AuthProviderCache;
};
