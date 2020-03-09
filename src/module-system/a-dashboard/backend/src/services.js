const version = require('./service/version.js');
const profile = require('./service/profile.js');

module.exports = app => {
  const services = {
    version,
    profile,
  };
  return services;
};
