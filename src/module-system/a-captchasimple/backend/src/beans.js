const captchaSimple = require('./bean/captcha.simple.js');

module.exports = app => {
  const beans = {
    // captcha
    'captcha.simple': {
      mode: 'ctx',
      bean: captchaSimple,
    },
  };
  return beans;
};
