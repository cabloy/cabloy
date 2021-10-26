const test = require('./service/test.js');

module.exports = app => {
  const services = {
    test,
  };
  return services;
};
