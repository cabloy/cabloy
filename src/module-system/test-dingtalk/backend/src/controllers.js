const version = require('./controller/version.js');
const test = require('./controller/test.js');

module.exports = app => {
  const controllers = {
    version,
    test,
  };
  return controllers;
};
