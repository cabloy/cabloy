module.exports = appInfo => {
  const config = {};

  // queue
  config.queue = {
    redlock: {
      options: {
        lockTTL: 60 * 1000,
      },
    },
  };

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        hook: {
          meta: {
            long_query_time: 200,
          },
        },
      },
    },
  };

  return config;
};
