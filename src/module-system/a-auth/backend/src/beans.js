const versionManager = require('./bean/version.manager.js');
const localAuthProviderBase = require('./bean/local.authProviderBase.js');
const startupRegisterPassport = require('./bean/startup.registerPassport.js');
const beanAuthProvider = require('./bean/bean.authProvider.js');

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
    // startup
    'startup.registerPassport': {
      mode: 'app',
      bean: startupRegisterPassport,
    },
    // global
    authProvider: {
      mode: 'ctx',
      bean: beanAuthProvider,
      global: true,
    },
  };
  return beans;
};
