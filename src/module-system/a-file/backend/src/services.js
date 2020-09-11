const file = require('./service/file.js');

module.exports = app => {
  const services = {
    file,
  };
  return services;
};
