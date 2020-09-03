const version = require('./controller/version.js');
const captcha = require('./controller/captcha.js');

module.exports = app => {
  const controllers = {
    version,
    captcha,
  };
  return controllers;
};
