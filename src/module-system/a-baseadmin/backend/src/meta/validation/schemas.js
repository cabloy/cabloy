const roleRight = require('./schema/roleRight.js');
const roleResourceRight = require('./schema/roleResourceRight.js');
const roleFieldsRight = require('./schema/roleFieldsRight.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, roleRight(app));
  Object.assign(schemas, roleResourceRight(app));
  Object.assign(schemas, roleFieldsRight(app));
  return schemas;
};
