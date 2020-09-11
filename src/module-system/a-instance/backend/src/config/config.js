// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      bean: 'instance',
      global: true,
      dependencies: 'appReady',
      ignore: /\/version\/update$/,
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
