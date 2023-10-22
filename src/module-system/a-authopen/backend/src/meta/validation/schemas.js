const authOpen = require('./schema/authOpen.js');

module.exports = app => {
  const schemas = {};
  // authOpen
  Object.assign(schemas, authOpen(app));
  // ok
  return schemas;
};
