const version = require('./service/version.js');
const file = require('./service/file.js');

module.exports = app => {
  const services = {
    version,
    file,
  };
  return services;
};
