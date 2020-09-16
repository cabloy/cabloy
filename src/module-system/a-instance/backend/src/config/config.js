// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      bean: 'instance',
      global: true,
      dependencies: 'appReady',
    },
    appReady: {
      bean: 'appReady',
      global: true,
    },
  };

  // startups
  config.startups = {
  };

  // broadcasts
  config.broadcasts = {
    resetCache: {
      bean: 'resetCache',
    },
    reload: {
      bean: 'reload',
    },
  };

  return config;
};
