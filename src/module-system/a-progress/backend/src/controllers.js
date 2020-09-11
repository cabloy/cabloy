const progress = require('./controller/progress.js');

module.exports = app => {
  const controllers = {
    progress,
  };
  return controllers;
};
