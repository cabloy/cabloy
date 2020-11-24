const dashboardDefault = require('./dashboard/dashboardDefault.js');
const dashboardHome = require('./dashboard/dashboardHome.js');

module.exports = app => {
  const dashboards = [
    dashboardDefault(app),
    dashboardHome(app),
  ];
  return dashboards;
};
