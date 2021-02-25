const versionManager = require('./bean/version.manager.js');
const beanMessage = require('./bean/bean.message.js');
const statsMessage = require('./bean/stats.message.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    message: {
      mode: 'ctx',
      bean: beanMessage,
      global: true,
    },
    // stats
    'stats.message': {
      mode: 'ctx',
      bean: statsMessage,
    },
  };
  return beans;
};
