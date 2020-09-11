const {{atomClassName}} = require('./controller/{{atomClassName}}.js');

module.exports = app => {
  const controllers = {
    {{atomClassName}},
  };
  return controllers;
};
