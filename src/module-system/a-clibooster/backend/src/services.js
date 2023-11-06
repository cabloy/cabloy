const tools = require('./service/tools.js');

module.exports = app => {
  const services = {
    tools,
  };
  return services;
};
