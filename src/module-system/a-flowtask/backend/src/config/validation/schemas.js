const startEventAtom = require('./schema/startEventAtom.js');
const activityUserTask = require('./schema/activityUserTask.js');

module.exports = app => {
  const schemas = {};
  // startEventAtom
  Object.assign(schemas, startEventAtom(app));
  // activityUserTask
  Object.assign(schemas, activityUserTask(app));
  // ok
  return schemas;
};
