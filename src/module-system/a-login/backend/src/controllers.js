const auth = require('./controller/auth.js');

module.exports = app => {
  const controllers = {
    auth,
  };
  return controllers;
};
