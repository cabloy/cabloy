const beanValidation = require('./bean/bean.validation.js');
const middlewareValidate = require('./bean/middleware.validate.js');

module.exports = app => {
  const beans = {
    // middleware
    'middleware.validate': {
      mode: 'ctx',
      bean: middlewareValidate,
    },
    // global
    validation: {
      mode: 'ctx',
      bean: beanValidation,
      global: true,
    },
  };
  return beans;
};
