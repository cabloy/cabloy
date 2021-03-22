const {{atomClassName}} = require('./schema/{{atomClassName}}.js');

module.exports = app => {
  const schemas = {};
  // {{atomClassName}}
  Object.assign(schemas, {{atomClassName}}(app));
  // ok
  return schemas;
};
