const captcha = require('./controller/captcha.js');
const auth = require('./controller/auth.js');

module.exports = app => {
  const controllers = {
    captcha,
    auth,
  };
  return controllers;
};
