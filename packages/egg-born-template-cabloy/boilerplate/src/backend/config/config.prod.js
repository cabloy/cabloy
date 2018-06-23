module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{keys}}';

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root', // 'travis',
        password: '',
        database: 'cabloy-demo',
      },
    },
  };

  return config;
};
