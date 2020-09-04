const beanMail = require('./bean/bean.mail.js');

module.exports = app => {
  const beans = {
    // global
    mail: {
      mode: 'ctx',
      bean: beanMail,
      global: true,
    },
  };
  return beans;
};
