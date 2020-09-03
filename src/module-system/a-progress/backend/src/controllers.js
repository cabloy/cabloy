const version = require('./controller/version.js');
const progress = require('./controller/progress.js');

module.exports = app => {
  const controllers = {
    version,
    progress,
  };
  return controllers;
};
