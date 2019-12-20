const version = require('./service/version.js');
const event = require('./service/event.js');

module.exports = app => {
  const services = {
    version,
    event,
  };
  return services;
};
