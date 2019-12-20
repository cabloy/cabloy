const version = require('./service/version.js');
const message = require('./service/message.js');

module.exports = app => {
  const services = {
    version,
    message,
  };
  return services;
};
