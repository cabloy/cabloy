const sequence = require('./schema/sequence.js');

module.exports = app => {
  const schemas = {};
  // sequence
  Object.assign(schemas, sequence(app));
  // ok
  return schemas;
};
