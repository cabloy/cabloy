const flowTask = require('./service/flowTask.js');

module.exports = app => {
  const services = {
    flowTask,
  };
  return services;
};
