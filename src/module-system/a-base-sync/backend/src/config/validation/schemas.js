const user = require('./schema/user.js');
const category = require('./schema/category.js');
const resource = require('./schema/resource.js');
const role = require('./schema/role.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, user(app));
  Object.assign(schemas, category(app));
  Object.assign(schemas, resource(app));
  Object.assign(schemas, role(app));
  return schemas;
};
