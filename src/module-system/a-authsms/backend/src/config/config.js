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
  const _captchaSimple = {
    module: 'a-captchasimple',
    name: 'captcha',
  };
  const _captchaSMS = {
    module: 'a-authsms',
    name: 'captcha',
  };
  config.captcha = {
    scenes: {
      mobileVerify: null,
      signupCode: _captchaSimple,
      signup: _captchaSMS,
      signin: _captchaSMS,
    },
  };

  // sms provider
  config.sms = {
    provider: '',
  };

  return config;
};
