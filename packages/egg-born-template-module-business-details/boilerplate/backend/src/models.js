const {{atomClassName}} = require('./model/{{atomClassName}}.js');
const {{atomClassName}}Detail = require('./model/{{atomClassName}}Detail.js');

module.exports = app => {
  const models = {
    {{atomClassName}},
    {{atomClassName}}Detail,
  };
  return models;
};
