const captchaProvider = require('./bean/captcha.provider.captcha.js');

module.exports = {
  // captcha.provider
  'captcha.provider.captcha': {
    mode: 'ctx',
    bean: captchaProvider,
  },
};
