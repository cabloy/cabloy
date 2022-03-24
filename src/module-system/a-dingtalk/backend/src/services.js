const message = require('./service/message.js');
const contacts = require('./service/contacts.js');
const jssdk = require('./service/jssdk.js');
const auth = require('./service/auth.js');

module.exports = app => {
  const services = {
    message,
    contacts,
    jssdk,
    auth,
  };
  return services;
};
