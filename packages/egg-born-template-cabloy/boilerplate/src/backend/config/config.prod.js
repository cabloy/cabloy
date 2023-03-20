module.exports = appInfo => {
  const config = {};

  // keys
  config.keys = appInfo.name + '_{{safeKeys}}';

  // disabledModules
  config.disabledModules = [
    'test-flow', //
    'test-note',
  ];

  // disabledSuites
  config.disabledSuites = [
    'test-party', //
  ];

  // instances
  config.instances = [
    {
      subdomain: '',
      password: '',
      title: '',
      config: {
        'a-base': {
          cors: { whiteList: 'http://localhost' },
        },
      },
    },
  ];

  // modules
  config.modules = {
    'a-base': {
      account: {
        // warning: if set true, should setup the provider's account of mail/sms
        needActivation: false,
      },
    },
  };

  // mysql
  config.mysql = {
    default: {
      host: 'mysql', // see: docker-compose.yml
      port: '3306',
      user: '{{mysqlUserName}}',
      password: '{{mysqlUserPassword}}',
      database: '{{name}}',
      charset: 'utf8mb4_general_ci',
      hook: {
        meta: {
          long_query_time: 500,
        },
      },
    },
  };

  // redis
  config.redis = {
    default: {
      host: 'redis', // see: docker-compose.yml
      port: 6379,
      password: '',
      db: 0,
    },
  };

  return config;
};
