module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{keys}}';

  // instances
  config.instances = [
    { subdomain: '', password: '', title: '',
      config: {
        'a-base': {
          jsonp: { whiteList: '' },
          cors: { whiteList: '' },
        },
      },
    },
  ];

  // modules
  config.modules = {
  };

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: 'mysql',  // see: docker-compose.yml
        port: '3306',
        user: '{{mysqlUserName}}',
        password: '{{mysqlUserPassword}}',
        database: '{{name}}',
        hook: {
          meta: {
            long_query_time: 500,
          },
        },
      },
    },
  };

  // redis
  const __redisConnectionDefault = {
    host: 'redis', // see: docker-compose.yml
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
