const versionManager = require('./bean/version.manager.js');
const beanProgress = require('./bean/bean.progress.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  progress: {
    bean: beanProgress,
    global: true,
  },
};
