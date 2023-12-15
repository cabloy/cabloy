const beanValidation = require('./bean/bean.validation.js');
const middlewareValidate = require('./bean/middleware.validate.js');

module.exports = {
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
