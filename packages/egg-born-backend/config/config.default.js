const _config = require('../../../build/config.js');

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // cluster
  config.cluster = {
    listen: {
      port: _config.backend.port,
      hostname: _config.backend.hostname,
    },
  };

  // safe
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // mysql
  config.mysql = {
    app: true,
    agent: false,
  };

  // middlewares
  config.mws = {
    // safeAccess
    safeAccess: {
      whitelist: {
        '127.0.0.1': true,
      },
    },
  };

  // model
  config.model = {
    disableDeleted: false,
    disableInstance: false,
  };

  return config;
};
