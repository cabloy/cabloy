const versionManager = require('./bean/version.manager.js');
const beanMessage = require('./bean/bean.message.js');
const statsMessage = require('./bean/stats.message.js');
const localIoMessageUniformBase = require('./bean/local.ioMessageUniformBase.js');

module.exports = {
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
  // local
  'local.ioMessageUniformBase': {
    mode: 'ctx',
    bean: localIoMessageUniformBase,
  },
};
