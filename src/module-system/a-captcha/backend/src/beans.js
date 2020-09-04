const beanCaptcha = require('./bean/bean.captcha.js');

module.exports = app => {
  const beans = {
    // global
    captcha: {
      mode: 'ctx',
      bean: beanCaptcha,
      global: true,
    },
  };
  return beans;
};
