const smsProvider = require('./controller/smsProvider.js');
const captcha = require('./controller/captcha.js');
const auth = require('./controller/auth.js');

module.exports = app => {
  const controllers = { smsProvider, captcha, auth };
  return controllers;
};
