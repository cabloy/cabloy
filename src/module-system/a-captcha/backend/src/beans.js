const middlewareCaptchaVerify = require('./bean/middleware.captchaVerify.js');
const beanCaptcha = require('./bean/bean.captcha.js');

module.exports = {
  // middleware
  'middleware.captchaVerify': {
    bean: middlewareCaptchaVerify,
  },
  // global
  captcha: {
    bean: beanCaptcha,
    global: true,
  },
};
