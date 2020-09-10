// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    captchaVerify: {
      bean: 'captchaVerify',
      global: false,
      dependencies: 'auth',
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
