const share = require('./service/share.js');

module.exports = app => {
  const services = {
    share,
  };
  return services;
};
