const versionManager = require('./bean/version.manager.js');
const beanStatus = require('./bean/bean.status.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  status: {
    mode: 'ctx',
    bean: beanStatus,
    global: true,
  },
};
