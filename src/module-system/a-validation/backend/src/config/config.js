// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    validation: {
      global: true,
      dependencies: 'instance',
    },
    validate: {
      global: false,
    },
  };

  return config;
};
