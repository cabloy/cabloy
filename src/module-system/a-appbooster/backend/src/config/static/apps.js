const appSystem = require('./app/appSystem.js');

module.exports = app => {
  const apps = [
    //
    appSystem(app),
  ];
  return apps;
};
