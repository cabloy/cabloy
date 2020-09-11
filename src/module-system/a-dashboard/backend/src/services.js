const profile = require('./service/profile.js');

module.exports = app => {
  const services = {
    profile,
  };
  return services;
};
