const flowTask = require('./controller/flowTask.js');

module.exports = app => {
  const controllers = {
    flowTask,
  };
  return controllers;
};
