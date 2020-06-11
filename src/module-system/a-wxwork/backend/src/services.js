const version = require('./service/version.js');
const message = require('./service/message.js');
const contacts = require('./service/contacts.js');

const event = require('./service/event.js');
const jssdk = require('./service/jssdk.js');
const messageMini = require('./service/messageMini.js');
const authMini = require('./service/authMini.js');

module.exports = app => {
  const services = {
    version,
    message,
    contacts,

    event,
    jssdk,
    messageMini,
    authMini,
  };
  return services;
};
