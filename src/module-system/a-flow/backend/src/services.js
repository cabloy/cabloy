const flow = require('./service/flow.js');
const flowDef = require('./service/flowDef.js');

module.exports = app => {
  const services = {
    flow,
    flowDef,
  };
  return services;
};
