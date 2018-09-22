// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // public dir
  config.publicDir = '';

  // middlewares
  config.middlewares = {
    file: {
      global: false,
      dependencies: 'base',
    },
  };

  return config;
};
