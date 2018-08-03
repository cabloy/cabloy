const user = require('./service/user.js');

module.exports = app => {
  const services = {
    user,
  };
  return services;
};
