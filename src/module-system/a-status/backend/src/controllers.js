const status = require('./controller/status.js');

module.exports = app => {
  const controllers = {
    status,
  };
  return controllers;
};
