const versionManager = require('./bean/version.manager.js');
const beanProgress = require('./bean/bean.progress.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  progress: {
    mode: 'ctx',
    bean: beanProgress,
    global: true,
  },
};
