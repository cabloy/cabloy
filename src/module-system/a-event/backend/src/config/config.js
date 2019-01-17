// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    event: {
      global: true,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    installEvents: {
      type: 'all',
      path: 'event/installEvents',
    },
  };

  return config;
};
