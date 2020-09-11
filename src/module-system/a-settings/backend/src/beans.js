const versionManager = require('./bean/version.manager.js');
const beanSettings = require('./bean/bean.settings.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    settings: {
      mode: 'ctx',
      bean: beanSettings,
      global: true,
    },
  };
  return beans;
};
