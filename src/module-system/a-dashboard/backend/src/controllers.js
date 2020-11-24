const dashboard = require('./controller/dashboard.js');

module.exports = app => {
  const controllers = {
    dashboard,
  };
  return controllers;
};
