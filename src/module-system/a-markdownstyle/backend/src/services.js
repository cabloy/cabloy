const version = require('./service/version.js');

module.exports = app => {
  const services = {
    version,
  };
  return services;
};
