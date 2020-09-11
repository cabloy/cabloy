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

  // queues
  config.queues = {
    instanceStartup: {
      bean: 'instanceStartup',
    },
    registerInstance: {
      bean: 'registerInstance',
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
  };

  return config;
};
