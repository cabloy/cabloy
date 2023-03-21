const versionManager = require('./bean/version.manager.js');
const beanSummer = require('./bean/bean.summer.js');
const localCache = require('./bean/local.cache.js');
const localMem = require('./bean/local.mem.js');
const localRedis = require('./bean/local.redis.js');
const localFetch = require('./bean/local.fetch.js');
const broadcastMemDel = require('./bean/broadcast.memDel.js');
const broadcastMemMultiDel = require('./bean/broadcast.memMultiDel.js');
const broadcastMemClear = require('./bean/broadcast.memClear.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.cache': {
      mode: 'ctx',
      bean: localCache,
    },
    'local.mem': {
      mode: 'ctx',
      bean: localMem,
    },
    'local.redis': {
      mode: 'ctx',
      bean: localRedis,
    },
    'local.fetch': {
      mode: 'ctx',
      bean: localFetch,
    },
    // broadcast
    'broadcast.memDel': {
      mode: 'app',
      bean: broadcastMemDel,
    },
    'broadcast.memMultiDel': {
      mode: 'app',
      bean: broadcastMemMultiDel,
    },
    'broadcast.memClear': {
      mode: 'app',
      bean: broadcastMemClear,
    },
    // summer
    summer: {
      mode: 'ctx',
      bean: beanSummer,
      global: true,
    },
  };
  return beans;
};
