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
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: '{{name}}',
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
