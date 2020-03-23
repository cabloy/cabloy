// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // account
  config.account = {
    url: {
      mobileVerify: '/a/authsms/mobileVerify',
    },
  };

  // captcha scenes
  config.captcha = {
    scenes: {
      mobileVerify: null,
      signup: null,
      signin: null, // means using default
      // signin: {
      //   module: 'a-captchasms',
      //   name: 'captcha',
      // },
    },
  };

  return config;
};
