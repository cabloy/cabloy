const activityUserTask = require('./schema/activityUserTask.js');

module.exports = app => {
  const schemas = {};
  // activityUserTask
  Object.assign(schemas, activityUserTask(app));
  // ok
  return schemas;
};
