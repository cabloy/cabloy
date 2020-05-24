const version = require('./service/version.js');
const io = require('./service/io.js');

module.exports = app => {
  const services = {
    version,
    io,
  };
  return services;
};
