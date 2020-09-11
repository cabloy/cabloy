const message = require('./service/message.js');
const contacts = require('./service/contacts.js');
const jssdk = require('./service/jssdk.js');
const authMini = require('./service/authMini.js');

module.exports = app => {
  const services = {
    message,
    contacts,
    jssdk,
    authMini,
  };
  return services;
};
