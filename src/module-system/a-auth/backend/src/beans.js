const versionManager = require('./bean/version.manager.js');
const localAuthProviderBase = require('./bean/local.authProviderBase.js');
const localPassport = require('./bean/local.passport.js');
const broadcastAuthProviderChanged = require('./bean/broadcast.authProviderChanged.js');
const startupRegisterPassport = require('./bean/startup.registerPassport.js');
const startupRegisterRouters = require('./bean/startup.registerRouters.js');
const startupCacheAuthProviders = require('./bean/startup.cacheAuthProviders.js');
const beanAuthProvider = require('./bean/bean.authProvider.js');
const beanAuthProviderCache = require('./bean/bean.authProviderCache.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // local
  'local.authProviderBase': {
    bean: localAuthProviderBase,
  },
  'local.passport': {
    bean: localPassport,
  },
  // broadcast
  'broadcast.authProviderChanged': {
    bean: broadcastAuthProviderChanged,
  },
  // startup
  'startup.registerPassport': {
    bean: startupRegisterPassport,
  },
  'startup.registerRouters': {
    bean: startupRegisterRouters,
  },
  'startup.cacheAuthProviders': {
    bean: startupCacheAuthProviders,
  },
  // global
  authProvider: {
    bean: beanAuthProvider,
    global: true,
  },
  authProviderCache: {
    bean: beanAuthProviderCache,
    global: true,
  },
};
