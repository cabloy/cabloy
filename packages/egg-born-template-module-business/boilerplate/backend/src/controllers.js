const version = require('./controller/version.js');
const {{atomClassName}} = require('./controller/{{atomClassName}}.js');

module.exports = app => {
  const controllers = {
    version,
    {{atomClassName}},
  };
  return controllers;
};
