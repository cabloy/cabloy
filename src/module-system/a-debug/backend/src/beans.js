const versionManager = require('./bean/version.manager.js');
const beanDebug = require('./bean/bean.debug.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  debug: {
    mode: 'app',
    bean: beanDebug,
    global: true,
  },
};
