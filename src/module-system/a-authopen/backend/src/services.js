const authOpen = require('./service/authOpen.js');

module.exports = app => {
  const services = {
    authOpen,
  };
  return services;
};
