const profile = require('./controller/profile.js');

module.exports = app => {
  const controllers = {
    profile,
  };
  return controllers;
};
