const versionManager = require('./bean/version.manager.js');
const beanStatus = require('./bean/bean.status.js');
const queueStatusSet = require('./bean/queue.statusSet.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.statusSet': {
      mode: 'app',
      bean: queueStatusSet,
    },
    // global
    status: {
      mode: 'ctx',
      bean: beanStatus,
      global: true,
    },
  };
  return beans;
};
