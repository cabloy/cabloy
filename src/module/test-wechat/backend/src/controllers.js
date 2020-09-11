const test = require('./controller/test.js');

module.exports = app => {
  const controllers = {
    test,
  };
  return controllers;
};
