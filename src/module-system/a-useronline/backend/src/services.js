const userOnline = require('./service/userOnline.js');

module.exports = app => {
  const services = {
    userOnline,
  };
  return services;
};
