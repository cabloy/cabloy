const overtime = require('./schema/overtime.js');

module.exports = app => {
  const schemas = {};
  // overtime
  Object.assign(schemas, overtime(app));
  // ok
  return schemas;
};
