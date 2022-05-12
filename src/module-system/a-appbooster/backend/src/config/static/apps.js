const appSystem = require('./app/appSystem.js');
const appUnclassified = require('./app/appUnclassified.js');

module.exports = app => {
  const apps = [
    //
    appSystem(app),
    appUnclassified(app),
  ];
  return apps;
};
