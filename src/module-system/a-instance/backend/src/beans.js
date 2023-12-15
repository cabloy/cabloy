const versionManager = require('./bean/version.manager.js');
const beanInstance = require('./bean/bean.instance.js');
const broadcastResetCache = require('./bean/broadcast.resetCache.js');
const broadcastReload = require('./bean/broadcast.reload.js');
const middlewareAppReady = require('./bean/middleware.appReady.js');
const middlewareInstance = require('./bean/middleware.instance.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // broadcast
  'broadcast.resetCache': {
    mode: 'app',
    bean: broadcastResetCache,
  },
  'broadcast.reload': {
    mode: 'app',
    bean: broadcastReload,
  },
  // middleware
  'middleware.appReady': {
    mode: 'ctx',
    bean: middlewareAppReady,
  },
  'middleware.instance': {
    mode: 'ctx',
    bean: middlewareInstance,
  },
  // global
  instance: {
    mode: 'ctx',
    bean: beanInstance,
    global: true,
  },
};
