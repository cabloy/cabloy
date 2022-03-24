const message = require('./controller/message.js');
const jssdk = require('./controller/jssdk.js');
const authMini = require('./controller/authMini.js');

module.exports = app => {
  const controllers = {
    message,
    jssdk,
    authMini,
  };
  return controllers;
};
