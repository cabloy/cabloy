const version = require('./service/version.js');
const captcha = require('./service/captcha.js');

module.exports = app => {
  const services = {
    version,
    captcha,
  };
  return services;
};
