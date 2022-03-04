const userOnline = require('./schema/userOnline.js');

module.exports = app => {
  const schemas = {};
  // userOnline
  Object.assign(schemas, userOnline(app));
  // ok
  return schemas;
};
