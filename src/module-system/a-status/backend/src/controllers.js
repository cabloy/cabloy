const version = require('./controller/version.js');
const status = require('./controller/status.js');

module.exports = app => {
  const controllers = {
    version,
    status,
  };
  return controllers;
};
