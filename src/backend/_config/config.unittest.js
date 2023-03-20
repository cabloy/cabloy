module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_1596889047267_3245';

  // modules
  config.modules = {};

  // mysql
  config.mysql = {
    default: {
      host: '127.0.0.1',
      port: '3306', // for github actions
      user: 'root',
      password: 'root',
      database: 'mysql', // donnot change the name
      charset: 'utf8mb4_general_ci',
      hook: {
        meta: {
          long_query_time: 200,
        },
      },
    },
  };

  // redis
  config.redis = {
    default: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
  };

  return config;
};
