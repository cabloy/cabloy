const {{atomClassName}} = require('./schema/{{atomClassName}}.js');
const {{atomClassName}}Detail = require('./schema/{{atomClassName}}Detail.js');

module.exports = app => {
  const schemas = {};
  // {{atomClassName}}
  Object.assign(schemas, {{atomClassName}}(app));
  // {{atomClassName}} detail
  Object.assign(schemas, {{atomClassName}}Detail(app));
  // ok
  return schemas;
};
