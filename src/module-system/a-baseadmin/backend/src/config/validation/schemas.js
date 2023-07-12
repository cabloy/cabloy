const roleRight = require('./schema/roleRight.js');
const roleResourceRight = require('./schema/roleResourceRight.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, roleRight(app));
  Object.assign(schemas, roleResourceRight(app));
  return schemas;
};
