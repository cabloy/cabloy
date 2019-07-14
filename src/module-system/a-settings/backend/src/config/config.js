// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    settings: {
      global: true,
      dependencies: 'validation',
    },
  };

  return config;
};
