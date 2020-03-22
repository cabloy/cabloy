// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    captcha: {
      global: false,
      dependencies: 'auth,cachedb',
    },
    captchaVerify: {
      global: false,
      dependencies: 'auth,cachedb',
    },
  };

  // captcha scenes
  config.captcha = {
    scenes: {
      default: {
        module: 'a-captchasimple',
        name: 'captcha',
        timeout: 20 * 60 * 1000,
      },
    },
  };

  return config;
};
