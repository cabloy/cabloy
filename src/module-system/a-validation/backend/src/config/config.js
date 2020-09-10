// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    validate: {
      bean: 'validate',
      global: false,
    },
  };

  return config;
};
