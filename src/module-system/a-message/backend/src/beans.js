const versionManager = require('./bean/version.manager.js');
const beanMessage = require('./bean/bean.message.js');
const statsMessage = require('./bean/stats.message.js');
const localIoMessageUniformBase = require('./bean/local.ioMessageUniformBase.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  message: {
    bean: beanMessage,
    global: true,
  },
  // stats
  'stats.message': {
    bean: statsMessage,
  },
  // local
  'local.ioMessageUniformBase': {
    bean: localIoMessageUniformBase,
  },
};
