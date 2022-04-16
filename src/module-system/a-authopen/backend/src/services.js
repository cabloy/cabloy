const auth = require('./service/auth.js');
const authOpen = require('./service/authOpen.js');

module.exports = app => {
  const services = {
    auth,
    authOpen,
  };
  return services;
};
