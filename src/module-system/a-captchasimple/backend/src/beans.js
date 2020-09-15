const captchaProvider = require('./bean/captcha.provider.captcha.js');

module.exports = app => {
  const beans = {
    // captcha.provider
    'captcha.provider.captcha': {
      mode: 'ctx',
      bean: captchaProvider,
    },
  };
  return beans;
};
