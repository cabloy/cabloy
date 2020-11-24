const dashboard = require('./model/dashboard.js');
const dashboardContent = require('./model/dashboardContent.js');
const dashboardUser = require('./model/dashboardUser.js');
const dashboardFull = require('./model/dashboardFull.js');

module.exports = app => {
  const models = {
    dashboard,
    dashboardContent,
    dashboardUser,
    dashboardFull,
  };
  return models;
};
