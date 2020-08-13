const version = require('./service/version.js');
const callback = require('./service/callback.js');
const contacts = require('./service/contacts.js');
const event = require('./service/event.js');
const jssdk = require('./service/jssdk.js');
const auth = require('./service/auth.js');

module.exports = app => {
  const services = {
    version,
    callback,
    contacts,
    event,
    jssdk,
    auth,
  };
  return services;
};
