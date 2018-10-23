const version = require('./service/version.js');
const {{atomClassName}} = require('./service/{{atomClassName}}.js');

module.exports = app => {
  const services = {
    version,
    {{atomClassName}},
  };
  return services;
};
