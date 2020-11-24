const dashboard = require('./service/dashboard.js');

module.exports = app => {
  const services = {
    dashboard,
  };
  return services;
};
