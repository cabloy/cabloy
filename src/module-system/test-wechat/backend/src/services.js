const version = require('./service/version.js');
const event = require('./service/event.js');
const test = require('./service/test.js');

module.exports = app => {
  const services = {
    version,
    event,
    test,
  };
  return services;
};
