const version = require('./controller/version.js');
const callback = require('./controller/callback.js');
const contacts = require('./controller/contacts.js');

const jssdk = require('./controller/jssdk.js');
const auth = require('./controller/auth.js');


module.exports = app => {
  const controllers = {
    version,
    callback,
    contacts,
    jssdk,
    auth,
  };
  return controllers;
};
