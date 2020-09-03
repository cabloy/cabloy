const version = require('./controller/version.js');
const auth = require('./controller/auth.js');

module.exports = app => {
  const controllers = {
    version,
    auth,
  };
  return controllers;
};
