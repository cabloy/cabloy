module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{keys}}';

  // modules
  config.modules = {
  };

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'sys', // recommended
        hook: {
          meta: {
            long_query_time: 0,
          },
        },
      },
    },
  };

  // redis
  const __redisConnectionDefault = {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0,
  };
  const __redisConnectionDefaultCache = Object.assign({}, __redisConnectionDefault, {
    keyPrefix: `cache_${appInfo.name}:`,
  });

  config.redisConnection = {
    default: __redisConnectionDefault,
    cache: __redisConnectionDefaultCache,
  };

  config.redis = {
    clients: {
      limiter: config.redisConnection.default,
      queue: config.redisConnection.default,
      broadcast: config.redisConnection.default,
      cache: config.redisConnection.cache,
    },
  };

  return config;
};
