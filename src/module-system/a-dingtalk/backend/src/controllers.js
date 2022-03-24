const message = require('./controller/message.js');
const contacts = require('./controller/contacts.js');

const jssdk = require('./controller/jssdk.js');
const auth = require('./controller/auth.js');

module.exports = app => {
  const controllers = {
    message,
    contacts,
    jssdk,
    auth,
  };
  return controllers;
};
