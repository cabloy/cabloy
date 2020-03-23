const version = require('./service/version.js');
const captcha = require('./service/captcha.js');
const auth = require('./service/auth.js');

module.exports = app => {
  const services = {
    version,
    captcha,
    auth,
  };
  return services;
};
