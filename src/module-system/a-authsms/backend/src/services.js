const captcha = require('./service/captcha.js');
const auth = require('./service/auth.js');

module.exports = app => {
  const services = {
    captcha,
    auth,
  };
  return services;
};
