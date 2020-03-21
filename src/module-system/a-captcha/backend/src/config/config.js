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

  // scenes
  config.scenes = {
    modules: {
      'a-authsimple': {
        signup: {
          module: 'a-captchasimple',
          name: 'simple',
        },
        signin: {
          module: 'a-captchasimple',
          name: 'simple',
        },
      },
    },
  };

  // cache timeout
  config.cache = {
    timeout: 20 * 60 * 1000,
  };

  return config;
};
