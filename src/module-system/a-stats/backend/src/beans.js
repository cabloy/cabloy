const versionManager = require('./bean/version.manager.js');
const queueStats = require('./bean/queue.stats.js');
const beanStats = require('./bean/bean.stats.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.stats': {
      mode: 'app',
      bean: queueStats,
    },
    // global
    stats: {
      mode: 'ctx',
      bean: beanStats,
      global: true,
    },
  };
  return beans;
};
