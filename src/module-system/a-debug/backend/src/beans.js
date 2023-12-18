const versionManager = require('./bean/version.manager.js');
const beanDebug = require('./bean/bean.debug.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  debug: {
    bean: beanDebug,
    global: true,
  },
};
