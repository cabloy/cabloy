const detail = require('./service/detail.js');

module.exports = app => {
  const services = {
    detail,
  };
  return services;
};
