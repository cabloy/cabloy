module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_1510355512387_5878';

  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'sys',
      },
    },
  };

  return config;
};
