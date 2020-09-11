const progress = require('./service/progress.js');

module.exports = app => {
  const services = {
    progress,
  };
  return services;
};
