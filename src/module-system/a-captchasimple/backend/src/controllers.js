const captcha = require('./controller/captcha.js');

module.exports = app => {
  const controllers = {
    captcha,
  };
  return controllers;
};
