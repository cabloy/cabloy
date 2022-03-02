const versionManager = require('./bean/version.manager.js');
const localSessionStore = require('./bean/local.sessionStore.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.sessionStore': {
      mode: 'app',
      bean: localSessionStore,
    },
  };
  return beans;
};
