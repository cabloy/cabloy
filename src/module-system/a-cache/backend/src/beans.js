const localDb = require('./bean/local.db.js');
const localMem = require('./bean/local.mem.js');
const localRedis = require('./bean/local.redis.js');
const broadcastMemClear = require('./bean/broadcast.memClear.js');
const broadcastMemRemove = require('./bean/broadcast.memRemove.js');
const beanCache = require('./bean/bean.cache.js');
const queueCacheDbSet = require('./bean/queue.cacheDbSet.js');

module.exports = app => {
  const beans = {
    // local
    'local.db': {
      mode: 'ctx',
      bean: localDb,
    },
    'local.mem': {
      mode: 'ctx',
      bean: localMem,
    },
    'local.redis': {
      mode: 'ctx',
      bean: localRedis,
    },
    // broadcast
    'broadcast.memClear': {
      mode: 'ctx',
      bean: broadcastMemClear,
    },
    // broadcast
    'broadcast.memRemove': {
      mode: 'ctx',
      bean: broadcastMemRemove,
    },
    // queue
    'queue.cacheDbSet': {
      mode: 'app',
      bean: queueCacheDbSet,
    },
    // global
    cache: {
      mode: 'ctx',
      bean: beanCache,
      global: true,
    },
  };
  return beans;
};
