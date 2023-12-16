const sequence = require('./schema/sequence.js');
const startEventTimer = require('./schema/startEventTimer.js');
const activityService = require('./schema/activityService.js');

const schemas = {};
// sequence
Object.assign(schemas, sequence);
// startEventTimer
Object.assign(schemas, startEventTimer);
// activityService
Object.assign(schemas, activityService);
// ok
module.exports = schemas;
