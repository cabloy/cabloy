const flow = require('./service/flow.js');

module.exports = app => {
  const services = {
    flow,
  };
  return services;
};
