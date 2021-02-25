const message = require('./service/message.js');

module.exports = app => {
  const services = {
    message,
  };
  return services;
};
