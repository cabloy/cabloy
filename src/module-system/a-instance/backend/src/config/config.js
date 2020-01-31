// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      global: true,
      dependencies: 'cachemem',
      ignore: /(\/version\/(update))/,
    },
  };

  // startups
  config.startups = {
    startupInstance: {
      type: 'all',
      instance: true,
      path: 'instance/startup',
    },
  };

  // broadcasts
  config.broadcasts = {
    resetCache: {
      path: 'instance/broadcast/resetCache',
    },
  };

  return config;
};
