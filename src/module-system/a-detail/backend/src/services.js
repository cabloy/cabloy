const base = require('./service/base.js');
const detail = require('./service/detail.js');

module.exports = app => {
  const services = {
    base,
    detail,
  };
  return services;
};
