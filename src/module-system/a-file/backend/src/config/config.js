// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    file: {
      global: false,
      dependencies: 'base',
    },
  };

  return config;
};
