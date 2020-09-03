const version = require('./controller/version.js');

module.exports = app => {
  const controllers = {
    version,
  };
  return controllers;
};
