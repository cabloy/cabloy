const versionManager = require('./bean/version.manager.js');
const beanSummer = require('./bean/bean.summer.js');
const localCache = require('./bean/local.cache.js');
const localMem = require('./bean/local.mem.js');
const localRedis = require('./bean/local.redis.js');
const localFetch = require('./bean/local.fetch.js');
const broadcastMemDel = require('./bean/broadcast.memDel.js');
const broadcastMemMultiDel = require('./bean/broadcast.memMultiDel.js');
const broadcastMemClear = require('./bean/broadcast.memClear.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // local
  'local.cache': {
    bean: localCache,
  },
  'local.mem': {
    bean: localMem,
  },
  'local.redis': {
    bean: localRedis,
  },
  'local.fetch': {
    bean: localFetch,
  },
  // broadcast
  'broadcast.memDel': {
    bean: broadcastMemDel,
  },
  'broadcast.memMultiDel': {
    bean: broadcastMemMultiDel,
  },
  'broadcast.memClear': {
    bean: broadcastMemClear,
  },
  // summer
  summer: {
    bean: beanSummer,
    global: true,
  },
};
