const roleRight = require('./schema/roleRight.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, roleRight(app));
  return schemas;
};
