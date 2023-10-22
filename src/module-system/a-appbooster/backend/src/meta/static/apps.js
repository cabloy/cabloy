const appGeneral = require('./app/appGeneral.js');
const appSystem = require('./app/appSystem.js');
const appUnclassified = require('./app/appUnclassified.js');

module.exports = app => {
  const apps = [
    //
    appGeneral(app),
    appSystem(app),
    appUnclassified(app),
  ];
  return apps;
};
