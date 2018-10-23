const {{atomClassName}} = require('./model/{{atomClassName}}.js');

module.exports = app => {
  const models = {
    {{atomClassName}},
  };
  return models;
};
