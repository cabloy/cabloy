const message = require('./service/message.js');
const jssdk = require('./service/jssdk.js');
const authMini = require('./service/authMini.js');

module.exports = app => {
  const services = {
    message,
    jssdk,
    authMini,
  };
  return services;
};
