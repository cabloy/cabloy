const sequence = require('./schema/sequence.js');
const startEventTimer = require('./schema/startEventTimer.js');
const activityService = require('./schema/activityService.js');

module.exports = app => {
  const schemas = {};
  // sequence
  Object.assign(schemas, sequence(app));
  // startEventTimer
  Object.assign(schemas, startEventTimer(app));
  // activityService
  Object.assign(schemas, activityService(app));
  // ok
  return schemas;
};
