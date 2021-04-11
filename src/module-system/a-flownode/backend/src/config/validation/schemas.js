const sequence = require('./schema/sequence.js');
const startEventTimer = require('./schema/startEventTimer.js');

module.exports = app => {
  const schemas = {};
  // sequence
  Object.assign(schemas, sequence(app));
  // startEventTimer
  Object.assign(schemas, startEventTimer(app));
  // ok
  return schemas;
};
