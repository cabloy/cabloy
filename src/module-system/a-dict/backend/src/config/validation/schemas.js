const dict = require('./schema/dict.js');

module.exports = app => {
  const schemas = {};
  // dict
  Object.assign(schemas, dict(app));
  // ok
  return schemas;
};
