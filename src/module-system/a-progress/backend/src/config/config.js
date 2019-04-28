// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    progress: {
      global: false,
      dependencies: 'instance',
    },
  };

  // check
  config.check = {
    timeoutDelay: 5000,
  };

  return config;
};
