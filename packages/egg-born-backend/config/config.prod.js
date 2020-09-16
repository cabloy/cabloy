// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // proxy
  config.proxy = true;

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
            long_query_time: 500,
          },
        },
      },
    },
  };

  return config;
};
