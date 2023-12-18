const versionManager = require('./bean/version.manager.js');
const ioMessageMail = require('./bean/io.message.mail.js');
const ioChannelMail = require('./bean/io.channel.mail.js');
const broadcastMailSceneChanged = require('./bean/broadcast.mailSceneChanged.js');
const startupCacheMailScenes = require('./bean/startup.cacheMailScenes.js');
const beanMail = require('./bean/bean.mail.js');
const beanMailSceneCache = require('./bean/bean.mailSceneCache.js');

module.exports = {
  // version
  'version.manager': {
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
    bean: broadcastMailSceneChanged,
  },
  // startup
  'startup.cacheMailScenes': {
    bean: startupCacheMailScenes,
  },
  // global
  mail: {
    bean: beanMail,
    global: true,
  },
  mailSceneCache: {
    bean: beanMailSceneCache,
    global: true,
  },
};
