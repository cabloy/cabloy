const instance = require('./controller/instance.js');

module.exports = app => {
  const controllers = {
    instance,
  };
  return controllers;
};
