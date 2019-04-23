const version = require('./service/version.js');
const progress = require('./service/progress.js');

module.exports = app => {
  const services = {
    version,
    progress,
  };
  return services;
};
