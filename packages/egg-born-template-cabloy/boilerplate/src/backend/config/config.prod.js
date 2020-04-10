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
  config.redisDefault = {
    host: 'redis', // see: docker-compose.yml
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
