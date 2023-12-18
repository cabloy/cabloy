const versionManager = require('./bean/version.manager.js');
const beanInstance = require('./bean/bean.instance.js');
const broadcastResetCache = require('./bean/broadcast.resetCache.js');
const broadcastReload = require('./bean/broadcast.reload.js');
const middlewareAppReady = require('./bean/middleware.appReady.js');
const middlewareInstance = require('./bean/middleware.instance.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // broadcast
  'broadcast.resetCache': {
    bean: broadcastResetCache,
  },
  'broadcast.reload': {
    bean: broadcastReload,
  },
  // middleware
  'middleware.appReady': {
    bean: middlewareAppReady,
  },
  'middleware.instance': {
    bean: middlewareInstance,
  },
  // global
  instance: {
    bean: beanInstance,
    global: true,
  },
};
