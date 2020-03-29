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

  return config;
};
