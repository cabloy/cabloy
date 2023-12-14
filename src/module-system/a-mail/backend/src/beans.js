const versionManager = require('./bean/version.manager.js');
const ioMessageMail = require('./bean/io.message.mail.js');
const ioChannelMail = require('./bean/io.channel.mail.js');
const broadcastMailSceneChanged = require('./bean/broadcast.mailSceneChanged.js');
const startupCacheMailScenes = require('./bean/startup.cacheMailScenes.js');
const beanMail = require('./bean/bean.mail.js');
const beanMailSceneCache = require('./bean/bean.mailSceneCache.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // io
    'io.message.mail': {
      bean: ioMessageMail,
    },
    'io.channel.mail': {
      bean: ioChannelMail,
    },
    // broadcast
    'broadcast.mailSceneChanged': {
      mode: 'app',
      bean: broadcastMailSceneChanged,
    },
    // startup
    'startup.cacheMailScenes': {
      mode: 'app',
      bean: startupCacheMailScenes,
    },
    // global
    mail: {
      mode: 'ctx',
      bean: beanMail,
      global: true,
    },
    mailSceneCache: {
      mode: 'ctx',
      bean: beanMailSceneCache,
      global: true,
    },
  };
  return beans;
};
