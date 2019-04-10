// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    captchaContainer: {
      global: false,
      dependencies: 'cachedb',
    },
    captchaVerify: {
      global: false,
      dependencies: 'auth,cachedb',
    },
  };

  // provider
  config.provider = {
    module: 'a-captchasimple',
    name: 'simple',
  };

  // cache timeout
  config.cache = {
    timeout: 20 * 60 * 1000,
  };

  return config;
};
