module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_1509007922020_3083';

  // module config
  config.module = {
    'aa-hello': {
    },
  };

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'travis',
        password: '',
        database: 'egg-born',
      },
    },
  };

  return config;
};
