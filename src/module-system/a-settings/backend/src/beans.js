const versionManager = require('./bean/version.manager.js');
const beanSettings = require('./bean/bean.settings.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  settings: {
    bean: beanSettings,
    global: true,
  },
};
