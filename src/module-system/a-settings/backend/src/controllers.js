const version = require('./controller/version.js');
const settings = require('./controller/settings.js');

module.exports = app => {
  const controllers = {
    version,
    settings,
  };
  return controllers;
};
