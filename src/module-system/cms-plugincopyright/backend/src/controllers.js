const util = require('./controller/util.js');

module.exports = app => {
  const controllers = {
    util,
  };
  return controllers;
};
