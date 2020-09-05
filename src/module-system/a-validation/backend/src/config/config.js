// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    validate: {
      global: false,
    },
  };

  return config;
};
