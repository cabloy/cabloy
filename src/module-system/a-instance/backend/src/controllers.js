const version = require('./controller/version.js');
const instance = require('./controller/instance.js');

module.exports = app => {
  const controllers = {
    version,
    instance,
  };
  return controllers;
};
