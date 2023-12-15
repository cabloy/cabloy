const versionManager = require('./bean/version.manager.js');
const beanShare = require('./bean/bean.share.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  share: {
    mode: 'ctx',
    bean: beanShare,
    global: true,
  },
};
