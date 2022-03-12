const versionManager = require('./bean/version.manager.js');
const beanAuthProvider = require('./bean/bean.authProvider.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
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
