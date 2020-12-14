const stats = require('./controller/stats.js');

module.exports = app => {
  const controllers = {
    stats,
  };
  return controllers;
};
