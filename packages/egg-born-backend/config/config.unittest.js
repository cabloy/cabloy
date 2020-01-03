module.exports = appInfo => {
  const config = {};

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
