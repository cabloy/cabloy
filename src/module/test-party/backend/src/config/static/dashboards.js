const dashboardTest = require('./dashboard/dashboardTest.js');

module.exports = app => {
  const dashboards = [dashboardTest(app)];
  return dashboards;
};
