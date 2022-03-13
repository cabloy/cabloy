const versionManager = require('./bean/version.manager.js');
const localAuthProviderBase = require('./bean/local.authProviderBase.js');
const broadcastAuthProviderChanged = require('./bean/broadcast.authProviderChanged.js');
const startupRegisterPassport = require('./bean/startup.registerPassport.js');
const startupInstallAuthProviders = require('./bean/startup.installAuthProviders.js');
const startupCacheAuthProviders = require('./bean/startup.cacheAuthProviders.js');
const beanAuthProvider = require('./bean/bean.authProvider.js');
const beanAuthProviderCache = require('./bean/bean.authProviderCache.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.authProviderBase': {
      mode: 'ctx',
      bean: localAuthProviderBase,
    },
    // broadcast
    'broadcast.authProviderChanged': {
      mode: 'app',
      bean: broadcastAuthProviderChanged,
    },
    // startup
    'startup.registerPassport': {
      mode: 'app',
      bean: startupRegisterPassport,
    },
    'startup.installAuthProviders': {
      mode: 'app',
      bean: startupInstallAuthProviders,
    },
    'startup.cacheAuthProviders': {
      mode: 'app',
      bean: startupCacheAuthProviders,
    },
    // global
    authProvider: {
      mode: 'ctx',
      bean: beanAuthProvider,
      global: true,
    },
    authProviderCache: {
      mode: 'ctx',
      bean: beanAuthProviderCache,
      global: true,
    },
  };
  return beans;
};
