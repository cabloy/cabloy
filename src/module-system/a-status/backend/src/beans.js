const versionManager = require('./bean/version.manager.js');
const beanStatus = require('./bean/bean.status.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  status: {
    bean: beanStatus,
    global: true,
  },
};
