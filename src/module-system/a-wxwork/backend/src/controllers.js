const message = require('./controller/message.js');
const contacts = require('./controller/contacts.js');

const jssdk = require('./controller/jssdk.js');
const authMini = require('./controller/authMini.js');

module.exports = app => {
  const controllers = {
    message,
    contacts,
    jssdk,
    authMini,
  };
  return controllers;
};
