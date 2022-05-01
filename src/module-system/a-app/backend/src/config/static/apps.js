const appAnonymous = require('./app/appAnonymous.js');
const appDefault = require('./app/appDefault.js');

module.exports = app => {
  const apps = [appAnonymous(app), appDefault(app)];
  return apps;
};
