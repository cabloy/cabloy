const appBase = require('./app/appBase.js');
const appDefault = require('./app/appDefault.js');

module.exports = app => {
  const apps = [appBase(app), appDefault(app)];
  return apps;
};
