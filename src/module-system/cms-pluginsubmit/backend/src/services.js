const util = require('./service/util.js');

module.exports = app => {
  const services = {
    util,
  };
  return services;
};
