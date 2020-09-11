const settings = require('./controller/settings.js');

module.exports = app => {
  const controllers = {
    settings,
  };
  return controllers;
};
