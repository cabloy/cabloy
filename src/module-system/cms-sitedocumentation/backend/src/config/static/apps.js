const appDocumentation = require('./app/appDocumentation.js');

module.exports = app => {
  const apps = [
    //
    appDocumentation(app),
  ];
  return apps;
};
