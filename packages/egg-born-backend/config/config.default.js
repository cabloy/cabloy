const _config = require('../../../build/config.js');

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

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

  // cluster
  config.cluster = {
    listen: {
      port: _config.backend.port,
      hostname: _config.backend.hostname,
    },
  };

  return config;
};
