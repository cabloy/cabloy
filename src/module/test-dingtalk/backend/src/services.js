const version = require('./service/version.js');
const test = require('./service/test.js');

module.exports = app => {
  const services = {
    version,
    test,
  };
  return services;
};
