const versionManager = require('./bean/version.manager.js');
const localDb = require('./bean/local.db.js');
const localMem = require('./bean/local.mem.js');
const localRedis = require('./bean/local.redis.js');
const broadcastMemClear = require('./bean/broadcast.memClear.js');
const broadcastMemRemove = require('./bean/broadcast.memRemove.js');
const beanCache = require('./bean/bean.cache.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // local
  'local.db': {
    bean: localDb,
  },
  'local.mem': {
    bean: localMem,
  },
  'local.redis': {
    bean: localRedis,
  },
  // broadcast
  'broadcast.memClear': {
    bean: broadcastMemClear,
  },
  // broadcast
  'broadcast.memRemove': {
    bean: broadcastMemRemove,
  },
  // global
  cache: {
    bean: beanCache,
    global: true,
  },
};
