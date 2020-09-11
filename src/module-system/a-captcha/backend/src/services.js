const captcha = require('./service/captcha.js');

module.exports = app => {
  const services = {
    captcha,
  };
  return services;
};
