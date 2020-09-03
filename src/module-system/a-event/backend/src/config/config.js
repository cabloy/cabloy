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

  return config;
};
