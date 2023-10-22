const appCommunity = require('./app/appCommunity.js');

module.exports = app => {
  const apps = [
    //
    appCommunity(app),
  ];
  return apps;
};
