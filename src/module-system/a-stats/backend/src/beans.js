const versionManager = require('./bean/version.manager.js');
const queueStats = require('./bean/queue.stats.js');
const beanStats = require('./bean/bean.stats.js');
const ioMessageStats = require('./bean/io.message.stats.js');
const statsDeps = require('./bean/stats.deps.js');

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
    // io
    'io.message.stats': {
      bean: ioMessageStats,
    },
    // global
    stats: {
      mode: 'ctx',
      bean: beanStats,
      global: true,
    },
    // stats
    'stats.deps': {
      mode: 'ctx',
      bean: statsDeps,
    },
  };
  return beans;
};
