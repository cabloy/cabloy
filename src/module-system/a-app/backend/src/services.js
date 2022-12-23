const resource = require('./service/resource.js');
module.exports = app => {
  const services = { resource };
  return services;
};
