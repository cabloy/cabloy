const authOpen = require('./controller/authOpen.js');

module.exports = app => {
  const controllers = {
    authOpen,
  };
  return controllers;
};
