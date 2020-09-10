// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      global: true,
      dependencies: 'appReady',
      ignore: /\/version\/update$/,
    },
    appReady: {
      global: true,
    },
  };

  // startups
  config.startups = {
  };

  // broadcasts
  config.broadcasts = {
    resetCache: {
      bean: 'resetCache',
    },
  };

  return config;
};
