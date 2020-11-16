const flow = require('./controller/flow.js');
const flowTask = require('./controller/flowTask.js');

module.exports = app => {
  const controllers = {
    flow,
    flowTask,
  };
  return controllers;
};
