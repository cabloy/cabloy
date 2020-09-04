const localDb = require('./bean/local.db.js');
const localMem = require('./bean/local.mem.js');
const localRedis = require('./bean/local.redis.js');
const beanCache = require('./bean/bean.cache.js');

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
    // global
    cache: {
      mode: 'ctx',
      bean: beanCache,
      global: true,
    },
  };
  return beans;
};
