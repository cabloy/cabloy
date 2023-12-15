const versionManager = require('./bean/version.manager.js');
const beanSettings = require('./bean/bean.settings.js');

module.exports = {
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
