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
    mode: 'app',
    bean: versionManager,
  },
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
    mode: 'app',
    bean: broadcastMemClear,
  },
  // broadcast
  'broadcast.memRemove': {
    mode: 'app',
    bean: broadcastMemRemove,
  },
  // global
  cache: {
    mode: 'ctx',
    bean: beanCache,
    global: true,
  },
};
