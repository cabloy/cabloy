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
  config.redisDefault = {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0,
  };
  config.redisDefaultCache = Object.assign({}, config.redisDefault, {
    keyPrefix: `cache_${appInfo.name}:`,
  });

  config.redis = {
    clients: {
      limiter: config.redisDefault,
      queue: config.redisDefault,
      broadcast: config.redisDefault,
      cache: config.redisDefaultCache,
    },
  };

  return config;
};
