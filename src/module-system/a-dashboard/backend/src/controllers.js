const version = require('./controller/version.js');
const profile = require('./controller/profile.js');

module.exports = app => {
  const controllers = {
    version,
    profile,
  };
  return controllers;
};
