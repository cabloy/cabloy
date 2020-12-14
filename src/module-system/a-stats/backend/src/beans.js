const versionManager = require('./bean/version.manager.js');
const beanStats = require('./bean/bean.stats.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
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
