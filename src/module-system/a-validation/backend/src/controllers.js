const validation = require('./controller/validation.js');

module.exports = app => {
  const controllers = {
    validation,
  };
  return controllers;
};
