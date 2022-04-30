const app = require('./schema/app.js');

module.exports = app => {
  const schemas = {};
  // app
  Object.assign(schemas, app(app));
  // ok
  return schemas;
};
