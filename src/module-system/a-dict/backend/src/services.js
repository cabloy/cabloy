const dict = require('./service/dict.js');

module.exports = app => {
  const services = {
    dict,
  };
  return services;
};
