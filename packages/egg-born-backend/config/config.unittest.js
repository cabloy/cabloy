module.exports = appInfo => {
  const config = {};

  // mysql
  config.mysql = {
    app: true,
    agent: false,
    default: {
      connectionLimit: 100,
    },
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
