const versionManager = require('./bean/version.manager.js');
const queueStats = require('./bean/queue.stats.js');
const beanStats = require('./bean/bean.stats.js');
const ioMessageStats = require('./bean/io.message.stats.js');
const statsDeps = require('./bean/stats.deps.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // queue
  'queue.stats': {
    bean: queueStats,
  },
  // io
  'io.message.stats': {
    bean: ioMessageStats,
  },
  // global
  stats: {
    bean: beanStats,
    global: true,
  },
  // stats
  'stats.deps': {
    bean: statsDeps,
  },
};
