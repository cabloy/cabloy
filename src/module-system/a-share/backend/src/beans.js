const versionManager = require('./bean/version.manager.js');
const beanShare = require('./bean/bean.share.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  share: {
    bean: beanShare,
    global: true,
  },
};
