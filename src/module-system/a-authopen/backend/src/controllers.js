const auth = require('./controller/auth.js');
const authOpen = require('./controller/authOpen.js');

module.exports = app => {
  const controllers = {
    auth,
    authOpen,
  };
  return controllers;
};
