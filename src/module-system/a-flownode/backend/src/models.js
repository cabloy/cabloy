const flowNodeStartEventAtomCondition = require('./model/flowNodeStartEventAtomCondition.js');
const flowTask = require('./model/flowTask.js');
const flowTaskHistory = require('./model/flowTaskHistory.js');

module.exports = app => {
  const models = {
    flowNodeStartEventAtomCondition,
    flowTask,
    flowTaskHistory,
  };
  return models;
};
