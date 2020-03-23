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
      signin: {
        module: 'a-authsms',
        name: 'captcha',
      },
    },
  };

  // sms provider
  config.sms = {
    provider: '',
  };

  return config;
};
