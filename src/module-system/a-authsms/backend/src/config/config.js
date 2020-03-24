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
  // const _captchaSimple = {
  //   module: 'a-captchasimple',
  //   name: 'captcha',
  // };
  const _captchaSMS = {
    module: 'a-authsms',
    name: 'captcha',
  };
  config.captcha = {
    scenes: {
      mobileVerify: _captchaSMS,
      signup: _captchaSMS,
      signin: _captchaSMS,
      signupCode: null, // _captchaSimple,
    },
  };

  // sms provider
  config.sms = {
    provider: {
      default: '',
    },
    providers: {
      aliyun: {
        accessKeyId: '',
        secretAccessKey: '',
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25',
        signName: '',
        templates: {
          mobileVerify: '',
          signup: '',
          signin: '',
        },
      },
    },
  };

  return config;
};
