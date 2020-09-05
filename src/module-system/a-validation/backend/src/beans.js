const beanValidation = require('./bean/bean.validation.js');

module.exports = app => {
  const beans = {
    // global
    validation: {
      mode: 'ctx',
      bean: beanValidation,
      global: true,
    },
  };
  return beans;
};
