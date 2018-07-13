const _config = require('../../../build/config.js');

const {
  isProd,
  detectStatus,
  detectErrorMessage,
  accepts,
} = require('egg-onerror/lib/utils');

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
  };

  // model
  config.model = {
    disableDeleted: false,
    disableInstance: false,
  };

  // onerror
  config.onerror = {
    json(err) {
      const status = detectStatus(err);

      this.status = status;
      const code = err.code || err.type;
      const message = detectErrorMessage(this, err);

      // json error
      const errorJson = {
        code,
        message,
        errors: err.errors,
      };

      if (status >= 500 && !isProd(this.app)) {
        // provide detail error stack in local env
        errorJson.stack = err.stack;
        errorJson.name = err.name;
        for (const key in err) {
          if (!errorJson[key]) {
            errorJson[key] = err[key];
          }
        }
      }

      this.body = errorJson;
    },
  };

  return config;
};
