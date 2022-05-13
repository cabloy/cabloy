const appCms = require('./app/appCms.js');

module.exports = app => {
  const apps = [
    //
    appCms(app),
  ];
  return apps;
};
