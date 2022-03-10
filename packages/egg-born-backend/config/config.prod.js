// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // proxy
  config.proxy = true;
  config.ipHeaders = 'x-real-ip,x-forwarded-for';

  // mysql
  config.mysql = {
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
