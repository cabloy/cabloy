const flow = require('./controller/flow.js');

module.exports = app => {
  const controllers = {
    flow,
  };
  return controllers;
};
