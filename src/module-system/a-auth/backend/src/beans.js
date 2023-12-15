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
    mode: 'app',
    bean: versionManager,
  },
  // local
  'local.authProviderBase': {
    mode: 'ctx',
    bean: localAuthProviderBase,
  },
  'local.passport': {
    mode: 'ctx',
    bean: localPassport,
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
  'startup.registerRouters': {
    mode: 'app',
    bean: startupRegisterRouters,
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
