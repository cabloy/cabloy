const appTools = require('./app/appTools.js');

module.exports = app => {
  const apps = [
    //
    appTools(app),
  ];
  return apps;
};
