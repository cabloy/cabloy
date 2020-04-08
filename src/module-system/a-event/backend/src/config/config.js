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
      path: 'event/installEvents',
    },
  };

  return config;
};
