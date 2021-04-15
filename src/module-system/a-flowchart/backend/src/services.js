const flowDef = require('./service/flowDef.js');

module.exports = app => {
  const services = {
    flowDef,
  };
  return services;
};
