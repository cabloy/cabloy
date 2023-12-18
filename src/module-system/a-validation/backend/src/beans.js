const beanValidation = require('./bean/bean.validation.js');
const middlewareValidate = require('./bean/middleware.validate.js');

module.exports = {
  // middleware
  'middleware.validate': {
    bean: middlewareValidate,
  },
  // global
  validation: {
    bean: beanValidation,
    global: true,
  },
};
