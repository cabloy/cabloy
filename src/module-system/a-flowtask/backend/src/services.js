const flow = require('./service/flow.js');
const flowTask = require('./service/flowTask.js');

module.exports = app => {
  const services = {
    flow,
    flowTask,
  };
  return services;
};
