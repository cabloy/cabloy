const dashboardAnonymous = require('./dashboard/dashboardAnonymous.js');
const dashboardHome = require('./dashboard/dashboardHome.js');

module.exports = app => {
  const dashboards = [dashboardAnonymous(app), dashboardHome(app)];
  return dashboards;
};
