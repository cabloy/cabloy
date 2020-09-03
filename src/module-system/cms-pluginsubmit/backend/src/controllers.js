const version = require('./controller/version.js');
const util = require('./controller/util.js');

module.exports = app => {
  const controllers = {
    version,
    util,
  };
  return controllers;
};
