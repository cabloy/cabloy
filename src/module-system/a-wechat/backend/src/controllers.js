const version = require('./controller/version.js');
const message = require('./controller/message.js');
const jssdk = require('./controller/jssdk.js');
const messageMini = require('./controller/messageMini.js');
const authMini = require('./controller/authMini.js');

module.exports = app => {
  const controllers = {
    version,
    message,
    jssdk,
    messageMini,
    authMini,
  };
  return controllers;
};
