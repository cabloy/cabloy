const {{atomClassName}} = require('./service/{{atomClassName}}.js');

module.exports = app => {
  const services = {
    {{atomClassName}},
  };
  return services;
};
