const schemaApp = require('./schema/app.js');

module.exports = app => {
  const schemas = {};
  // app
  Object.assign(schemas, schemaApp(app));
  // ok
  return schemas;
};
